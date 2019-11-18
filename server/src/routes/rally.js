import express from 'express'
import cron from 'node-cron'
import { Rally} from '../models/rally';
import { auth } from '../middleware/auth';
import { Item } from '../models/item';
import { asyncForEach } from '../utils/methods'

const router = new express.Router

var rallyTask

const updateRallyQueue = async () => {
    try {
        const startRally = await Rally.find({status: 'active'}).sort({"activationDate": -1 }).limit(1)
        const finishRally = await Rally.find({status: 'active'}).sort({"expiryDate": -1 }).limit(1)

        if(!startRally || !finishRally){
            console.log('There is no rally for update criteria!')
            return
        }

        if(startRally._id !== finishRally._id){
            console.log('przypau')
        }
        //...
        // designate schedule time

        //finishRally
        rallyTask = cron.schedule("* * * * *", async () => {
            console.log(`this message logs every minute`);
            try{
                await finishRally()
                
            }catch(e) {
                console.log(e.message)
            }
            
            
        });

    }catch (e) {
        return
    }
}


router.post('/rally', auth, async (req, res) =>{

    const rally = new Rally(req.body)

    try {
        await rally.save()
        await updateRallyQueue()
        res.status(201).send(rally)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.put('/rally', auth, async (req, res) =>{

    try {
        let rally = await Rally.findById(req.body._id)

        rally = req.body

        //??delete rally._id
        
        await rally.save()
        await updateRallyQueue()
        res.status(200).send(rally)
    } catch (e) {
        res.status(400).send(e)
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
  
    try {
      const rally = await Rally.findById(req.body._id)
  
      updates.forEach(update => {
        rally[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
      });
  
      await rally.save();
  
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



//TO-DO: FINISH!!!!
async function addAwards(user, awardsLevels){
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

const finishRally = async () => {
    try{
        const rally = await Rally.findById(req.body._id).populate({
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
        rallyTask.destroy()
        return

    }catch(e){
        return e
    }



}



router.get('/triggerCron', auth, async(req, res) => {
    rallyTask = cron.schedule("* * * * *", async () => {
        console.log(`this message logs every minute`);
        try{
            const res = getCron()
            console.log(res)
        }catch(e) {
            console.log(e.message)
        }
        
        
    });
    res.send()
    
})

const getCron = () => {
    console.log('hello from getCron')
    rallyTask.destroy()
    return Date.now()
}


export const rallyRouter = router