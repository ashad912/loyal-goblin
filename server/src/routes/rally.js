import express from 'express'
import cron from 'node-cron'
import moment from 'moment'
import { Rally} from '../models/rally';
import { auth } from '../middleware/auth';
import { Item } from '../models/item';
import { asyncForEach } from '../utils/methods'
import { createCipher } from 'crypto';

const router = new express.Router

var rallyStartTask
var rallyFinishTask
var rallyTestTask

const startRally = async (rally) => {
    try{
        rally.status = 'active'
        await rally.save()
        rallyStartTask.destroy()
    }catch(e){
        return e
    }

}


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

const finishRally = async (rally) => {
    try{
        await rally.populate({
            path: 'awardsLevels.awardsLevel.awards'
        }).populate({
            path: 'users.profile'
        }).execPopulate()

        const users = rally.users

        await asyncForEach(users, async (rallyUser) => {
            
                const user = await User.findById(rallyUser.profile._id).populate({
                    path: 'activeRally'
                })
                if(user.activeRally && rallyUser.experience > 0){
                    const items = await addAwards(rallyUser, rally.awardsLevels)
                    user.bag = [...user.bag, items]
                }
                await user.save() 
            
            
        })

        rally.status = 'archive'
        await rally.save()
        rallyFinishTask.destroy()
        return

    }catch(e){
        return e
    }

}

const designateScheduleTime = (date) => {
    const momentDate = moment(date)
    const month = momentDate.month() + 1
    const dayOfMonth = momentDate.date()
    const hour = momentDate.hour()
    const minutes = momentDate.minutes()
    const seconds = momentDate.seconds()

    return `${seconds} ${minutes} ${hour} ${dayOfMonth} ${month} *`
}

//NOTE: -cron checked (without db)
export const updateRallyQueue = async () => {
    try {
        
        if(rallyStartTask){
            rallyStartTask.destroy()
        }
        if(rallyFinishTask){
            rallyFinishTask.destroy()
        }
        
        
        
        const firstToActivate = await Rally.find({status: 'active'}).sort({"activationDate": -1 }).limit(1)
        const firstToExpire = await Rally.find({status: 'active'}).sort({"expiryDate": -1 }).limit(1)

        // const firstToActivate = {
        //     _id: 'halo1234',
        //     activationDate: '2019-11-19T15:55:00.000+00:00',
        //     expiryDate: '2019-11-19T15:56:00.000+00:00'
        // }

        // const firstToExpire = firstToActivate
        
        if(!firstToActivate.length || !firstToExpire.length){
            console.log('There is no rally for update criteria!')
            return
        }

        if(firstToActivate._id.toString() !== firstToExpire._id.toString()){
            console.log('Gap in frontend validation!')
        }
        
        
        //startRally
        rallyStartTask = cron.schedule(designateScheduleTime(firstToActivate.activationDate), () => {
            
            try{
                startRally(firstToActivate)
                
                
            }catch(e) {
                console.log(e.message)
            }
            
            
        },
        {
            scheduled: true,
            timezone: "Europe/Warsaw"
        })

        //finishRally
        rallyFinishTask = cron.schedule(designateScheduleTime(firstToExpire.expiryDate), () => {
            
            try{
                finishRally(firstToExpire)
                
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

// 

router.get('/getAdminRallyList', auth, async (req, res) => {
    try {
        const rallyList = await Rally.find({status: { $not: 'archive'}})
        res.send(rallyList)
    }catch(e){
        res.status(400).send(e.message)
    }
    

})

router.post('/rally', auth, async (req, res) =>{

    const rally = new Rally(req.body)

    try {
        await rally.save()
        
        await updateRallyQueue()
        res.status(201).send(rally)
    } catch (e) {
        res.status(400).send(e.message)
    }
})



router.patch("/rally", auth, async (req, res, next) => {
    const updates = Object.keys(req.body);
    // const allowedUpdates = ["name", "password"];
  
    // const isValidOperation = updates.every(update => {
    //   return allowedUpdates.includes(update);
    // });
  
    // if (!isValidOperation) {
    //   return res.status(400).send({ error: "Invalid update!" });
    // }

    const forbiddenUpdates = ["_id"];
  
    const isValidOperation = updates.every(update => {
        return !forbiddenUpdates.includes(update);
    });
  
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid update!" });
    }
  
    try {
      const rally = await Rally.findById(req.body._id)
  
      updates.forEach(update => {
        rally[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
      });
  
      await rally.save();

      if(updates.includes("activationDate") || updates.includes('expiryDate')){
        await updateRallyQueue()
      }

      res.send(rally);
    } catch (e) {
      res.status(400).send(e);
    }
  });

router.delete('/rally', auth, async (req, res) =>{

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







router.get('/triggerCron', auth, async(req, res) => {
    
    
    rallyTestTask = cron.schedule("* * * * * *", async () => {
        //console.log(`this message logs every minute`);
        try{
            getCron()
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

const getCron = () => {
    console.log('hello from testTask')
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