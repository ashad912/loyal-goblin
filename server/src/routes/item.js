import express from 'express'
import { asyncForEach, saveImage, saveAppearanceImage, removeImage } from '../utils/methods'
import { ItemModel } from '../models/itemModel';
import { Mission } from '../models/mission';
import { MissionInstance } from '../models/missionInstance';
import { Rally } from '../models/rally';
import { User } from '../models/user';
import { auth } from '../middleware/auth';
import { Item } from '../models/item';


const uploadIconPath = "../client/public/images/items/"
const uploadAppearancePath = "../client/public/images/appearance/"

const router = new express.Router



////ADMIN-SIDE

///MODEL


router.get('/itemModels', auth, async(req,res) => {
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
router.post('/createModel', auth, async (req, res) =>{
    

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

router.patch('/uploadModelImages/:id', auth, async (req, res) => {
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
router.patch("/updateModel", auth, async (req, res, next) => {
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
router.delete('/removeModel', auth, async (req, res) =>{

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


///INSTANCE

//OK
router.post('/create', auth, async (req, res) =>{


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
        console.log(item)

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
router.delete('/remove', auth, async (req, res) =>{

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

////USER-SIDE

// blank

//

////TESTS

//REFACTOR - left here for backup

router.post('/testItemModelRemove', auth, async (req, res) => {
    const itemModel = await ItemModel.findById(req.body._id)

    

    //const itemInstancesIds = itemInstances.map(itemInstance => itemInstance._id)

    //console.log(itemInstancesIds)

    ////DONE IN item middleware
    // let users = await User.find({bag: {$elemMatch: {$in: itemInstancesIds}}})

    // //console.log(users)
    // //OK!
    // //res.send(users.map((user) => user._id))
    // await asyncForEach(users, async (user) => {
    //     await asyncForEach(itemInstancesIds, async (itemId) => {
    //     user.bag = user.bag.filter((bagItem) => {
    //         return bagItem._id.toString() !== itemId.toString()
    //     })

    //     await asyncForEach(Object.keys(user.equipped.toJSON()), (category) => {
    //         //console.log(category, user.equipped[category], itemId)
    //         if(user.equipped[category] && (user.equipped[category].toString() === itemId.toString())){
    //             user.equipped[category] = null //or remove key?
    //         }
    //     })

        
    //     })
    //     console.log(user._id)
    //     console.log(user.bag)
    //     // console.log(user.equipped)
    //     //await user.save()
    // })
    // //OK!
    
    itemModel.remove()
    res.send()

    // res.send(await Rally.updateMany(
    //     {'awardsLevels': 
    //       {$elemMatch:
    //         {$or: [
    //             {'awards.any': {$elemMatch: {'itemModel': itemModel._id}}},
    //             {'awards.warrior': {$elemMatch: {'itemModel': itemModel._id}}},
    //             {'awards.rogue': {$elemMatch: {'itemModel': itemModel._id}}},
    //             {'awards.mage': {$elemMatch: {'itemModel': itemModel._id}}},
    //             {'awards.cleric': {$elemMatch: {'itemModel': itemModel._id}}},
    //         ]}
    //       }
    //     }, 
    //     //https://docs.mongodb.com/manual/reference/operator/update/positional/
    //     //https://docs.mongodb.com/manual/reference/operator/update/positional-all/
    //         {$pull: {
    //           'awardsLevels.$[].awards.any': {'itemModel': itemModel._id},
    //           'awardsLevels.$[].awards.warrior': {'itemModel': itemModel._id},
    //           'awardsLevels.$[].awards.rogue': {'itemModel': itemModel._id},
    //           'awardsLevels.$[].awards.mage': {'itemModel': itemModel._id},
    //           'awardsLevels.$[].awards.cleric': {'itemModel': itemModel._id}
    //         }
          
    //     }))

    //mission - amultes, awards; 
    // let missions = await Mission.find(
    //     {$or: [
    //         {'amulets': {$elemMatch: {'itemModel': itemModel._id}}},
    //         {'awards.any': {$elemMatch: {'itemModel': itemModel._id}}},
    //         {'awards.warrior': {$elemMatch: {'itemModel': itemModel._id}}},
    //         {'awards.rogue': {$elemMatch: {'itemModel': itemModel._id}}},
    //         {'awards.mage': {$elemMatch: {'itemModel': itemModel._id}}},
    //         {'awards.cleric': {$elemMatch: {'itemModel': itemModel._id}}},
    //     ] })

    
    // //OK!
    // await asyncForEach((missions), async mission => {
    //     mission.amulets = mission.amulets.filter((mission, index)=> {
    //         return mission.itemModel.toString() !== itemModel._id.toString()
    //     })
    //     await asyncForEach(Object.keys(mission.awards.toJSON()), async (className) => { //need toJSON to remove 'mongo keys'
            
            
    //         mission.awards[className] = mission.awards[className].filter((classAward) => {
    //             // /console.log('eq', classAward.itemModel, itemModel._id)
    //             return classAward.itemModel.toString() !== itemModel._id.toString()
    //         })
            
    //     })
    //     //console.log(mission._id)
    //     //console.log(mission.amulets)
    //     //console.log(mission.awards)
    //     await mission.save()
    // })
    
    // //OK!


    // //rally - awardsLevels -> awards
    // let rallies = await Rally.find(
        
    //     {'awardsLevels': {$elemMatch:
    //         {$or: [
    //             {'awards.any': {$elemMatch: {'itemModel': itemModel._id}}},
    //             {'awards.warrior': {$elemMatch: {'itemModel': itemModel._id}}},
    //             {'awards.rogue': {$elemMatch: {'itemModel': itemModel._id}}},
    //             {'awards.mage': {$elemMatch: {'itemModel': itemModel._id}}},
    //             {'awards.cleric': {$elemMatch: {'itemModel': itemModel._id}}},
    //         ]}
    //     }})
    
    // //OK

    // await asyncForEach(rallies, async rally => {
    //     await asyncForEach(rally.awardsLevels, async (awardsLevel, index) => {
    //         await asyncForEach(Object.keys(awardsLevel.awards.toJSON()), async (className) => {
    //             rally.awardsLevels[index].awards[className] = rally.awardsLevels[index].awards[className].filter((classAward) => {
    //                 return classAward.itemModel.toString() !== itemModel._id.toString()
    //             })
    //         })
    //     })
    //     //console.log(rally._id)
    //     //console.log(rally.awardsLevels)
    //     await rally.save()
    // })
    
    // // //OK

    // //will be changed from: model to itemModel!!!
    // //const itemInstances = await Item.find({model: itemModel._id})

    // //await Item.deleteMany({model: itemModel._id}) <- does not trigger pre remove middleware
    
    // await asyncForEach((itemInstances), async itemInstance => {
    //     //console.log(itemInstance._id)
    //     await itemInstance.remove() //running 'pre remove' item middleware
    // })
    //res.send()
    
})



router.post('/testItemRemove', auth, async (req,res) => {
    const item = req.body
    // let user = await User.findOne({bag: {$elemMatch: {$eq: item._id}}})
    // console.log('halo user', user)
    // if(user){
    //     user.bag = user.bag.filter((bagItem) => {
    //         return bagItem._id.toString() !== item._id.toString
    //     })

    //     await asyncForEach(Object.keys(user.equipped.toJSON()), (category) => {
    //         if(user.equipped[category].toString() === item._id.toString()){
    //             user.equipped[category] = null //or remove key?
    //         }
    //     })

    //     await user.save()
    // }
    // {$pull: {
    //     'awardsLevels.$[].awards.any': {'itemModel': itemModel._id},
    //     'awardsLevels.$[].awards.warrior': {'itemModel': itemModel._id},
    //     'awardsLevels.$[].awards.rogue': {'itemModel': itemModel._id},
    //     'awardsLevels.$[].awards.mage': {'itemModel': itemModel._id},
    //     'awardsLevels.$[].awards.cleric': {'itemModel': itemModel._id}
    //   }
    // await User.updateOne({
    //     bag: {$elemMatch: {$eq: item._id}}
    // }, {
    //     $pull: {
    //         'bag': {$eq: item._id},
    //         'equipped' ...
    //     }
    // })
})


export const itemRouter = router