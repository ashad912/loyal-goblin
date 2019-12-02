import express from 'express'
import { asyncForEach } from '../utils/methods'
import { ItemModel } from '../models/itemModel';
import { Mission } from '../models/mission';
import { MissionInstance } from '../models/missionInstance';
import { Rally } from '../models/rally';
import { User } from '../models/user';
import { auth } from '../middleware/auth';
import { Item } from '../models/item';

const router = new express.Router


router.post('/createModel', auth, async (req, res) =>{

    const itemModel = new ItemModel(req.body)

    try {
        await itemModel.save() //this method holds updated user!
        res.status(201).send(itemModel)
    } catch (e) {
        res.status(400).send(e)
    }
})



router.post('/create', auth, async (req, res) =>{

    //without adding to spefic user eq!

    const item = new Item(req.body)

    try {
        await item.save() //this method holds updated user!
        res.status(201).send(item)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/testUpdateUser', auth, async(req, res) => {
    const user = {_id: req.body._id}

    
    //await Item.deleteMany({owner: user._id})
    //what else - party logic? ->
    // await User.updateMany(
    //     {$or: [
    //         {'party.leader': user._id}, 
    //         {'party.members': { $elemMatch: {$eq: user._id}}}
    //     ]},
    //     {$set: {
    //         party: {members: []},
    //         activeOrder : {}
    //     }}
    // )
    //OK!
    

    //what else - rally
    // await Rally.updateMany(
    //     {"$and": [
    //         { users: { $elemMatch: {profile: user._id}}}, //wihout eq
    //         { $and: [{ activationDate: { $lte: new Date() } }, {expiryDate: { $gte: new Date() } }]}, //leave users in achive rallies
    //     ]},
    //     {$pull: {
    //         "users": {profile: user._id}
    //     }}
    // )

    //missionInstance
    const missionInstance = await MissionInstance.findOne({party: {$elemMatch: {user: user._id}}}).populate({
        path: "items"
    })
    
    await asyncForEach((missionInstance.items), async item => {
        await User.updateOne({_id: item.owner}, {$addToSet: {bag: item._id}})
    })
    res.send()

    // missionInstance.remove()
    
})


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