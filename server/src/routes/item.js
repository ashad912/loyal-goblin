import express from 'express'
import { saveImage, saveAppearanceImage, removeImage } from '../utils/methods'
import { ItemModel } from '../models/itemModel';
import { User } from '../models/user';
import { adminAuth } from '../middleware/adminAuth';
import { Item } from '../models/item';


const uploadIconPath = "../static/images/items/"
const uploadAppearancePath = "../static/images/appearance/"

const router = new express.Router



////ADMIN-SIDE

///MODEL


router.get('/itemModels', adminAuth, async(req,res) => {
    try{
        const itemModels = await ItemModel.find({}).populate({
            path: "perks.target.disc-product",
            select: '_id name' 
        })

        res.status(200).send(itemModels)
    }catch(e){
        console.log(e.message)
        res.status(500).send(e.message)
    }
})


//OK
router.post('/createModel', adminAuth, async (req, res) =>{
    

    const itemModel = new ItemModel(req.body)
    
    try {
        await itemModel.save() //this method holds updated user!
        console.log(itemModel)
        res.status(201).send(itemModel._id)
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e.message)
    }
})

router.patch('/uploadModelImages/:id', adminAuth, async (req, res) => {
    try{
        if (!req.files) {
            throw new Error("Brak ikony przedmiotu")
        }

        const itemModel = await ItemModel.findById(req.params.id)
        if(!itemModel){
            throw new Error('Item model does not exist!')
        }

        const date = Date.now()

        if(req.files.icon){
            let icon = req.files.icon.data
            const imgSrc = await saveImage(icon, itemModel._id, uploadIconPath, itemModel.imgSrc, date)
            itemModel.imgSrc = imgSrc
        }
        
        if(req.files.appearance){
            let appearance = req.files.appearance.data
            const appearanceSrc = await saveAppearanceImage(appearance, itemModel._id, uploadAppearancePath, itemModel.appearanceSrc, date)
            itemModel.appearanceSrc = appearanceSrc
        }
        

        await itemModel.save()

        res.status(200).send()
    }catch(e){
        console.log(e.message)
        res.status(400).send(e.message)
    }
  
})

//OK
router.patch("/updateModel", adminAuth, async (req, res, next) => {
    let updates = Object.keys(req.body);
    const id = req.body._id


    updates = updates.filter((update) => {
        return update !== '_id' || update !== "imgSrc"
    })

    const forbiddenUpdates = [""];
  
    const isValidOperation = updates.every(update => {
        return !forbiddenUpdates.includes(update);
    });
  
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid update!" });
    }
  
    try {
      const itemModel = await ItemModel.findById(id)

      if(!itemModel){
        res.status(404).send()
      }
  
      updates.forEach(async (update) => {
            itemModel[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
      });

    //   if(req.files){
    //     let icon = req.files.icon
    //     const imgSrc = await saveImage(icon, itemModel._id, uploadPath, itemModel.imgSrc)
    //     itemModel.imgSrc = imgSrc
    //   }
  
      await itemModel.save();

      res.send(itemModel._id);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });



//OK
router.delete('/removeModel', adminAuth, async (req, res) =>{

    try {
        const itemModel = await ItemModel.findOne({_id: req.body._id})

        if(!itemModel){
            return res.status(404).send()
        }

        await removeImage(uploadIconPath, itemModel.imgSrc)

        await itemModel.remove()

        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})




////USER-SIDE

// blank

//

////TESTS

/// TEST ADMIN -> INSTANCE

//OK
router.post('/create', adminAuth, async (req, res) =>{


    const item = new Item(req.body)

    try {
        const user = await User.findById(req.body.owner)

        if(!user){
            throw Error('Invalid owner!')
        }

        const itemModel = await ItemModel.findById(req.body.itemModel)

        if(!itemModel){
            throw Error('Invalid model!')
        }
        
        await item.save()
        //console.log(item)

        //NOTE: without using 'post save' middleware (adding to bag) due to optimalization issues - less queries for adding awards

        await User.updateOne(
            {_id: req.body.owner},
            { $addToSet: { bag: item._id } }
        )
        // user.bag = [...user.bag, item._id]
        // await user.save()
        
        res.status(201).send(item)
    } catch (e) {
        res.status(400).send(e.message)
    }
})


//OK
router.delete('/remove', adminAuth, async (req, res) =>{

    try {
        const item = await Item.findOne({_id: req.body._id})

        if(!item){
            res.status(404).send()
        }

        await item.remove()

        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})


export const itemRouter = router