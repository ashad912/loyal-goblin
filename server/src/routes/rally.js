import express from 'express'
import cron from 'node-cron'
import moment from 'moment'
import { Rally } from '../models/rally';
import { auth } from '../middleware/auth';
import { Item } from '../models/item';
import { asyncForEach } from '../utils/methods'

const router = new express.Router


////ADMIN-SIDE

var rallyFinishTask
var rallyTestTask


const addAwards = async (user, awardsLevels) => {
    let items = []
    
    await asyncForEach(awardsLevels, async (awardsLevel) => {
        if(user.experience >= awardsLevel.level){
            await asyncForEach(Object.keys(awardsLevel), async (className) => {
                if(user.profile.class === className || className === 'any') {
                    await asyncForEach(className, async (item) => {
                        const newItem = new Item({model: item, owner: user.profile._id})
                        items = [...items, newItem]
                        await newItem.save()
                    })
                }
            }) 
        }
    })
    
    
    return items  
}

//CHECKED WITHOUT awards and users
const finishRally = async (rally) => {
    
    console.log(rally.awardsLevels)

    await rally.populate({
        path: 'awardsLevels.awards.any.itemModel'
    }).populate({
        path: 'awardsLevels.awards.warrior.itemModel'
    }).populate({
        path: 'awardsLevels.awards.rogue.itemModel'
    }).populate({
        path: 'awardsLevels.awards.mage.itemModel'
    }).populate({
        path: 'awardsLevels.awards.cleric.itemModel'
    }).populate({
        path: 'users.profile'
    }).execPopulate()

    console.log(rally.awardsLevels)

    const users = rally.users

    await asyncForEach(users, async (rallyUser) => {
        
            const user = await User.findById(rallyUser.profile._id).populate({
                path: 'activeRally'
            }) //recoginized as an array
            if(user.activeRally.length && rallyUser.experience > 0){
                const items = await addAwards(rallyUser, rally.awardsLevels)
                user.bag = [...user.bag, items]
            }
            await user.save() 
        
        
    })

    
    await rally.save()
    rallyFinishTask.destroy()
    await updateRallyQueue() //if update is to fast??

    return

    

}

const designateScheduleTime = (date) => {
    const momentDate = moment(date)
    const month = momentDate.month() + 1
    const dayOfMonth = momentDate.date()
    const hour = momentDate.hour()
    const minutes = momentDate.minutes()
    const seconds = momentDate.seconds()
    console.log(`${seconds} ${minutes} ${hour} ${dayOfMonth} ${month} *`)
    return `${seconds} ${minutes} ${hour} ${dayOfMonth} ${month} *`
}

//NOTE: - db ok, cron ok, CHECKED WITHOUT awards and users
export const updateRallyQueue = async () => {
    try {
        
        
        if(rallyFinishTask){ //what if is it not undefined - after restart
            rallyFinishTask.destroy()
        }
        
        const firstToStartArray = await Rally.find({ $and: [{ activationDate: { $lte: new Date() } }, {expiryDate: { $gte: new Date() } }]}).sort({"startDate": -1 }).limit(1)
        const firstToExpireArray = await Rally.find({ $and: [{ activationDate: { $lte: new Date() } }, {expiryDate: { $gte: new Date() } }]}).sort({"expiryDate": -1 }).limit(1)
        
        if(!firstToStartArray.length || !firstToExpireArray.length){
            console.log('There is no rally for update criteria!')
            return
        }

        
        const firstToStart = firstToStartArray[0]
        const firstToExpire = firstToExpireArray[0]

        // const firstToActivate = {
        //     _id: 'halo1234',
        //     activationDate: '2019-11-19T15:55:00.000+00:00',
        //     expiryDate: '2019-11-19T15:56:00.000+00:00'
        // }

        
        if(firstToStart._id.toString() !== firstToExpire._id.toString()){
            console.log('Gap in frontend validation!')
        }
        
        


        //finishRally
        rallyFinishTask = cron.schedule(designateScheduleTime(firstToExpire.expiryDate), async () => {
            
            try{
                
                await finishRally(firstToExpire)
                
            }catch(e) {
                console.log(e.message)
            }
            
         
        },
        {
            scheduled: true,
            timezone: "Europe/Warsaw"
        });

    }catch (e) {
        console.log(e.message)
    }
}

//CHECK
router.get('/listEventCreator', auth, async (req, res) => {
    try {
        const rallyList = await Rally.find({ $and: [{ activationDate: { $lte: new Date() } }, {expiryDate: { $gte: new Date() } }]})

        res.send(rallyList)
    }catch(e){
        res.status(400).send(e.message)
    }
    

})

//OK
router.post('/create', auth, async (req, res) =>{

    const rally = new Rally(req.body)

    try {
        await rally.save()
        
        await updateRallyQueue()
        res.status(201).send(rally)
    } catch (e) {
        res.status(400).send(e.message)
    }
})


//OK
router.patch("/update", auth, async (req, res, next) => {
    let updates = Object.keys(req.body);
    const rallyId = req.body._id

    updates = updates.filter((update) => {
        return update !== '_id'
    })

    const forbiddenUpdates = [""];
    
    const isValidOperation = updates.every(update => {
        return !forbiddenUpdates.includes(update);
    });
  
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid update!" });
    }
  
    try {
      const rally = await Rally.findById(rallyId)
  
      if(!rally){
          throw Error('Rally does not exist!')
      }
      updates.forEach(update => {
        rally[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
      });
  
      await rally.save();

      if(updates.includes("activationDate") || updates.includes('expiryDate') || updates.includes('startDate')){
        await updateRallyQueue()
      }

      res.send(rally);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

//CHECK
router.delete('/remove', auth, async (req, res) =>{

    try {
        const rally = await Rally.findOneAndDelete({_id: req.body._id})

        if(!rally){
            res.status(404).send()
        }
        await updateRallyQueue()
        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})

////USER-SIDE

//CHECK
router.get('/getFirst', auth, async (req, res)=> {
    try{
        const rally = await Rally.find({status: { $ne: 'archive'}}).sort({"activationDate": -1 }).limit(1)
        res.send(rally)
    }catch (e) {
        res.status(500).send(e.message)
    }
})



////////////////////TEST

router.get('/triggerCron', auth, async(req, res) => {
    
    var halo = 'haloVar'
    rallyTestTask = cron.schedule("* * * * * *", async () => {
        //console.log(`this message logs every minute`);
        try{
            getCron(halo)
        }catch(e) {
            console.log(e.message)
        }
        
        
    },
    
        {
            scheduled: true,
            timezone: "Europe/Warsaw"
        });
    res.send()
})

const getCron = (p) => {
    console.log('hello from testTask var:' + p)
    //rallyTestTask.destroy()
} 



export const rallyRouter = router

//const checkRallyDates = async (/*param*/) => {
//     const rallyList = [
//         {
//             activationDate: moment('2019-11-19T08:00:00.000+00:00'),
//             expiryDate: moment('2019-11-19T20:00:00.000+00:00')
//         },
//         {
//             activationDate: moment('2019-11-19T21:00:00.000+00:00'),
//             expiryDate: moment('2019-11-20T07:00:00.000+00:00')
//         },
//         {
//             activationDate: moment('2019-11-20T08:00:00.000+00:00'),
//             expiryDate: moment('2019-11-20T20:00:00.000+00:00')
//         },
//     ]

//     const rally = {
//         activationDate: moment('2019-11-19T20:03:00.000+00:00'),
//         expiryDate: moment('2019-11-19T20:02:00.000+00:00')
//     }

    
//     const newRallyStart = rally.activationDate.valueOf()
//     const newRallyEnd = rally.expiryDate.valueOf()

//     if(newRallyStart >= newRallyEnd){
//         console.log('switch dates, dummy boy')
//         return
//     }

//     let causingRallyList = []
//     await asyncForEach(rallyList, (rallyItem) => {
//         const existingRallyStart = rallyItem.activationDate.valueOf()
//         const existingRallyEnd = rallyItem.expiryDate.valueOf()

//         if(!((existingRallyStart < newRallyStart && existingRallyEnd < newRallyStart) || (existingRallyEnd > newRallyEnd && existingRallyStart > newRallyEnd))){
//             causingRallyList = [...causingRallyList, rallyItem] //assembling list of 'bad' rallies :<<
//         }
//     })

//     if(causingRallyList.length){
//         console.log(causingRallyList)
//     }else{
//         console.log('no problemo seniorita')
//     }
// }