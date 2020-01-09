import express from 'express'
import cron from 'node-cron'
import moment from 'moment'
import { Rally } from '../models/rally';
import { User } from '../models/user'
import { auth } from '../middleware/auth';
import { Item } from '../models/item';
import { asyncForEach, designateUserPerks, removeImage, saveImage } from '../utils/methods'


const uploadPath = "../client/public/images/rallies/"

const router = new express.Router


////ADMIN-SIDE

var rallyFinishTask
var rallyTestTask

//OK
const addAwards = async (user, awardsLevels, prevNewRallyAwards) => {
    let items = []
    let newRallyAwards = []
    if(prevNewRallyAwards && prevNewRallyAwards.length){
        newRallyAwards = [...prevNewRallyAwards]
    }
    await asyncForEach(awardsLevels, async (awardsLevel) => {
        
        if(user.experience >= awardsLevel.level){
            
            await asyncForEach(Object.keys(awardsLevel.awards.toJSON()), async (className) => {
                
                if(user.profile.class === className || className === 'any') {
                       
                    await asyncForEach(awardsLevel.awards[className], async (item) => {

                        const index = newRallyAwards.findIndex((award) => award.itemModel.toString() === item.itemModel.toString())
                        if(index > -1){
                            newRallyAwards[index].quantity += item.quantity
                        }else{
                            newRallyAwards = [...newRallyAwards, {quantity: item.quantity, itemModel: item.itemModel}] 
                        }
                        
                        
                        for(let i=0; i < item.quantity; i++) {
                            const newItem = new Item({itemModel: item.itemModel, owner: user.profile._id})
                            await newItem.save()
                            items = [...items, newItem._id]
                        }
                        
                    })
                }
            }) 
        }
    })
    
    
    return {items, newRallyAwards} 
}

//OK - CHECK PARTLY
const finishRally = async (rally) => {
    

 //CHECK: IS IT POPULATING?
    await rally.populate({
        path: 'users.profile'
    }).execPopulate()



    const users = rally.users

    await asyncForEach(users, async (rallyUser) => {

        try{
            const user = await User.findById(rallyUser.profile._id).populate({
                path: 'userRallies'
            }) //recoginized as an array
            console.log(user.userRallies, rallyUser.experience)

            //UPDATE TO CHECK
            const index = user.userRallies.findIndex((activeRally) => activeRally._id.toString() === rally._id.toString())

            if((user.userRallies.length) && (index >= 0) && (rallyUser.experience > 0)){ 
                const data = await addAwards(rallyUser, rally.awardsLevels, user.newRallyAwards)
                const items = data.items
                const newRallyAwards = data.newRallyAwards
                
                await User.updateOne(
                    {_id: user._id},
                    { $addToSet: { bag: { $each: items } }, $set: {newRallyAwards: newRallyAwards}, $inc: {experience: rally.experience} }
                )
                
            }
        }catch(e){
            console.log('Problem with user population!')
        }
           
            
            //
  
    })

    
    await rally.save()
    rallyFinishTask.destroy()
    await updateRallyQueue() //if update is to fast??

    return

    

}
//OK
const designateScheduleTime = (date) => {
    
    const momentDate = moment.utc(date) //was moment(date) for 'Europe/Warsaw'
    const month = momentDate.month() + 1
    const dayOfMonth = momentDate.date()
    const hour = momentDate.hour()
    const minutes = momentDate.minutes()
    const seconds = momentDate.seconds()
    console.log(`${seconds} ${minutes} ${hour} ${dayOfMonth} ${month} *`)
    return `${seconds} ${minutes} ${hour} ${dayOfMonth} ${month} *`
}

//OK
export const updateRallyQueue = async () => {
    try {
        
        
        if(rallyFinishTask){ //what if is it not undefined - after restart
            rallyFinishTask.destroy()
        }
        
        const firstToStartArray = await Rally.find({ $and: [{ activationDate: { $lte: new Date() } }, {expiryDate: { $gte: new Date() } }]}).sort({"startDate": 1 }).limit(1)
        const firstToExpireArray = await Rally.find({ $and: [{ activationDate: { $lte: new Date() } }, {expiryDate: { $gte: new Date() } }]}).sort({"expiryDate": 1 }).limit(1)
        
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
            
         
        },{
            scheduled: true,
            timezone: "Africa/Casablanca" //always UTC 0 //Warsaw UTC+1/UTC+2
        }
        );

    }catch (e) {
        console.log(e.message)
    }
}

//OK
router.get('/listEventCreator', auth, async (req, res) => {
    try {
        const rallyList = await Rally.find({expiryDate: { $gte: new Date() } })

        res.send(rallyList)
    }catch(e){
        res.status(400).send(e.message)
    }
    

})

//OK
router.post('/create', auth, async (req, res) =>{
    
    try {
    const rally = new Rally(req.body)

    const rallyList = await Rally.find({})

    let causingRallyList = [];
    const newRallyActivation = moment(rally.activationDate).valueOf()

    const newRallyEnd = moment(rally.expiryDate).valueOf()
        rallyList.forEach(rallyItem => {

          const existingRallyActiviation = moment(rallyItem.activationDate).valueOf();
          const existingRallyEnd = moment(rallyItem.expiryDate).valueOf();
         
          if (
            !(
              (existingRallyActiviation < newRallyActivation &&
                existingRallyEnd < newRallyActivation) ||
              (existingRallyEnd > newRallyEnd &&
                existingRallyActiviation > newRallyEnd)
            )
          ) {

           
            causingRallyList = [...causingRallyList, rallyItem]; //assembling list of 'bad' rallies :<<
          }

        });

    if(causingRallyList.length > 0){
        throw new Error('Znaleziono rajd o kolidujących terminach')
    }

        await rally.save()
        
        await updateRallyQueue()
        res.status(201).send(rally._id)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.patch('/uploadIcon/:id', auth, async (req, res) => {
    try{
        if (!req.files) {
            throw new Error("Brak ikony rajdu")
        }

        const rally = await Rally.findById(req.params.id)
        if(!rally){
            throw new Error('Rally does not exist!')
        }

        if(req.files.icon){
            let icon = req.files.icon.data
            const imgSrc = await saveImage(icon, rally._id, uploadPath, rally.imgSrc)
            rally.imgSrc = imgSrc
        }
        
        

        await rally.save()

        res.status(200).send()
    }catch(e){
        console.log(e.message)
        res.status(400).send(e.message)
    }
  
})

//OK
router.patch("/update", auth, async (req, res, next) => {
    let updates = Object.keys(req.body);
    const id = req.body._id

    updates = updates.filter((update) => {
        return update !== '_id'  || update !== "imgSrc"
    })

    const forbiddenUpdates = [""];
    
    const isValidOperation = updates.every(update => {
        return !forbiddenUpdates.includes(update);
    });
  
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid update!" });
    }
  
    try {
      const rally = await Rally.findById(id)
  
      if(!rally){
        res.status(404).send()
      }

      updates.forEach(update => {
        rally[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
      });

    //   if(req.files){
    //     let icon = req.files.icon.data
    //     const imgSrc = await saveImage(icon, rally._id, uploadPath, rally.imgSrc)
    //     rally.imgSrc = imgSrc
    //   }
  
      await rally.save();

      if(updates.includes("activationDate") || updates.includes('expiryDate') || updates.includes('startDate')){
        await updateRallyQueue()
      }

      res.send(rally._id);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

//OK
router.delete('/remove', auth, async (req, res) =>{

    try {

        const rally = await Rally.findOneAndDelete({_id: req.body._id})
 
        if(!rally){
           return res.status(404).send()
        }

        await removeImage(uploadPath, rally.imgSrc)

        await updateRallyQueue()
        
        res.sendStatus(200)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

////USER-SIDE

//OK
router.get('/first', auth, async (req, res)=> {
    try{
        const rallyArray = await Rally.find({ $and: [{ activationDate: { $lte: new Date() } }, {expiryDate: { $gte: new Date() } }]}).sort({"startDate": 1 }).limit(1)
        if(!rallyArray.length){
            res.send("")
            return
        }
        const rally = rallyArray[0]

        await rally.populate({
            path: 'awardsLevels.awards.any.itemModel awardsLevels.awards.warrior.itemModel awardsLevels.awards.rogue.itemModel awardsLevels.awards.mage.itemModel awardsLevels.awards.cleric.itemModel'
        }).execPopulate()

        rally.users = rally.users.filter((user) => { //return only user whoes fetched request
            return user.profile.toString() === req.user._id.toString()
        })
        res.send(rally) //can send undefined, what have to be supported by frontend
    }catch (e) {
        res.status(500).send(e.message)
    }
})





////////////////////TEST

router.get('/perks', auth, async(req,res) => {
    try{
        await designateUserPerks(req.user)
        res.send()
    }catch(e){
        res.status(400).send(e.message)
    }
    
})

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