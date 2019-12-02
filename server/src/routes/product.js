import express from 'express'
import { Product } from '../models/product';
import { auth } from '../middleware/auth';
import isEqual from 'lodash/isEqual'
import { asyncForEach } from '../utils/methods';
import { rallyRouter } from './rally';
import { Rally } from '../models/rally';

const router = new express.Router


////ADMIN-SIDE

//OK
router.post('/create', auth, async (req, res) =>{

    const product = new Product(req.body)

    try {
        await product.save()
        res.status(201).send(product)
    } catch (e) {
        res.status(500).send(e)
    }
})



//OK
router.patch("/update", auth, async (req, res, next) => {
    let updates = Object.keys(req.body);
    const id = req.body._id


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
      const product = await Product.findById(id)
  
      updates.forEach(update => {
        product[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
      });
  
      await product.save();

      res.send(product);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });



//OK
router.delete('/remove', auth, async (req, res) =>{

    try {
        const product = await Product.findOneAndDelete({_id: req.body._id})

        if(!product){
            res.status(404).send()
        }
        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})


////USER-SIDE

//OK
router.get('/shop', auth, async (req, res)=> {

    try{
        const shop = await Product.find({}).populate({
            path: 'awards.itemModel'
        })

        res.send(shop)
    }catch(e){
        res.status(400).send(e.message)
    }
})

//CHECK AND DEVELOP
router.post('/activate', auth, async (req, res)=> {

    const order = req.body

    try{
        if(Object.entries(user.activeOrder).length > 0 && user.activeOrder.constructor === Object){
                throw new Error('Another active order exists!')
        }
        const membersIds = [...user.party.members]

        console.log('got members ids', membersIds)

        if(!membersIds.length && !user.party.leader){ //one person party - giving user leader privileges
            user.party.leader = user._id
        }

        if(user.party.leader && (user.party.leader.toString() !== user._id.toString())){ //here are objectIDs - need to be string
            throw new Error('User is not the leader!')
        }

        user.activeOrder = order

        await user.save()

    }catch(e){
        res.status(400).send(e.message)
    }
})


//DEVELOP
//ADMIN?
router.post('/finalize', auth, async (req, res) => {
    //depends on source of request
    const party = req.party
    const user = req.user //if admin-side: get leader of this party

    try{
        //const order = await Order.findById(req.body.order)
        const activeRally = await Rally.findOne({ $and: [{ startDate: { $lte: moment() } }, {expiryDate: { $gte: moment() } }]})
        
        if(party.name !== user.party.name || party.leader.toString() !== user.party.leader.toString() || isEqual(party.members, user.party.members)){
            throw new Error('Party mismatch!')
        }
    
        const partyIds = [...user.party.members, party.leader]
    
        await asyncForEach((partyIds), async (memberId) => {
            const member = await User.findById(memberId)
            member.bag = [...member.bag /*, things from order*/]
            member.experience = member.experience /*+ exp from order for user*/
            await member.save()

            if(activeRally && !activeRally.users.includes(memberId.toString()/*!!! toString() - to CHECK! */)){
                activeRally.users = [...activeRally.users, memberId]
                await activeRally.save()
            }

        })

        res.send()
    }catch(e){
        res.status(500).send(e.message)
    }
 
})


export const productRouter = router