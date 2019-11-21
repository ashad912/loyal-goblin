import express from 'express'
import { Product } from '../models/product';
import { auth } from '../middleware/auth';
import isEqual from 'lodash/isEqual'
import { asyncForEach } from '../utils/methods';
import { rallyRouter } from './rally';
import { Rally } from '../models/rally';

const router = new express.Router


////ADMIN-SIDE

//CHECK
router.post('/create', auth, async (req, res) =>{

    const product = new Product(req.body)

    try {
        await product.save()
        res.status(201).send(product)
    } catch (e) {
        res.status(500).send(e)
    }
})



//CHECK
router.patch("/update", auth, async (req, res, next) => {
    const updates = Object.keys(req.body);

    const forbiddenUpdates = ["_id"];
  
    const isValidOperation = updates.every(update => {
        return !forbiddenUpdates.includes(update);
    });
  
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid update!" });
    }
  
    try {
      const product = await Product.findById(req.body._id)
  
      updates.forEach(update => {
        product[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
      });
  
      await product.save();

      res.send(product);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

//CHECK
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

//CHECK
router.get('/shop', auth, async (req, res)=> {

    try{
        const shop = await Product.find({})
        res.send(shop)
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