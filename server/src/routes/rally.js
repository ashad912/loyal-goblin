import express from 'express'
import { Rally } from '@models/rally';
import { adminAuth } from '@middleware/adminAuth';
import { auth } from '@middleware/auth';
import {removeImage, savePNGImage } from '@utils/methods'
import rallyStore from '@store/rally.store'
import { ItemModel } from '../models/itemModel';

const uploadPath = "../static/images/rallies/"

const router = new express.Router


////ADMIN-SIDE


//OK
router.get('/listEventCreator', adminAuth, async (req, res) => {
    try {
        const rallyList = await Rally.find({expiryDate: { $gte: new Date() } })

        res.send(rallyList)
    }catch(e){
        res.status(400).send(e.message)
    }
    

})

//OK
router.post('/create', adminAuth, async (req, res) =>{
    
    try {
        const rally = new Rally(req.body)


        await rally.conflictCheck()

        await rally.save()
        
        await rallyStore.updateQueue()
        res.status(201).send(rally._id)

    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

router.patch('/uploadIcon/:id', adminAuth, async (req, res) => {
    try{
        if (!req.files) {
            throw new Error("No rally icon")
        }

        const rally = await Rally.findById(req.params.id)
        if(!rally){
            throw new Error('Rally does not exist')
        }

        if(req.files.icon){
            let icon = req.files.icon.data
            const imgSrc = await savePNGImage(icon, rally._id, uploadPath, rally.imgSrc)
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
router.patch("/update", adminAuth, async (req, res, next) => {
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
        return res.status(404).send()
      }

      updates.forEach(update => {
        rally[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
      });

      await rally.save();

      if(updates.includes("activationDate") || updates.includes('expiryDate') || updates.includes('startDate')){
        await rallyStore.updateQueue()
      }

      res.send(rally._id);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

//OK
router.delete('/remove', adminAuth, async (req, res) =>{

    try {

        const rally = await Rally.findOneAndDelete({_id: req.body._id})
 
        if(!rally){
           return res.status(404).send()
        }

        await removeImage(uploadPath, rally.imgSrc)

        await rally.updateQueue()
        
        res.sendStatus(200)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

////USER-SIDE

//OK
router.get('/first', auth, async (req, res)=> {
    try{
        const rallyArray = await Rally
            .aggregate()
            .match({ $and: [{ activationDate: { $lte: new Date() } }, {expiryDate: { $gte: new Date() } }]})
            .project(rallyStore.rallyProjection(req.user._id))
            .sort({"startDate": 1 })
            .limit(1)
        if(!rallyArray.length){
            res.send("")
            return
        }
        const rally = rallyArray[0]

        if(!rally.awardsAreSecret){
            await ItemModel.rallyPopulate(rally)
        }
        
        res.send(rally) //can send undefined, what have to be supported by frontend
    }catch (e) {
        res.status(500).send(e.message)
    }
})


export const rallyRouter = router

