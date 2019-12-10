import express from 'express'
import { Product } from '../models/product';
import { auth } from '../middleware/auth';
import isEqual from 'lodash/isEqual'
import { asyncForEach, updatePerks, designateUserPerks } from '../utils/methods';
import { Rally } from '../models/rally';
import { User } from '../models/user'
import { Party } from '../models/party'

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

      if(!product){
        res.status(404).send()
      }
  
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

        await updatePerks(req.user, false)

        if(req.user.activeOrder.length){
           await req.user.populate({
                path: 'activeOrder.profile',
                select: "_id name avatar bag"
            }).execPopulate()
        }else{

            await req.user
            .populate({
                path: 'party',
                populate: {
                    path: "members",
                    select:'bag equipped',
                    populate: { path: "bag", populate: {path: 'itemModel'} },
                    
                }
            })
            .execPopulate();
        }


        res.send({shop, party: req.user.party, activeOrder: req.user.activeOrder})
    }catch(e){
        res.status(400).send(e.message)
    }
})

const verifyParty = (leader, membersIds, order) => {
    return new Promise( async (resolve, reject) => {

        try{
            const members = await User.find({
                $and: [
                    {_id: {$in: membersIds}},
                    {activeOrder: {$size: 0}} //checking active order - party
                ]
            })
    
            if(members.length !== membersIds.length){
                throw new Error('Not every member found OR member has another active order!')
            }
    
            // MORE COMPLEX WAY
            // await asyncForEach(membersIds, async (memberId) => {
            //     const member = await User.findById(memberId)
            //     if(!member){
            //         throw new Error(`Member ${member} does not exist!`)
            //     }
                
            //     if(member.activeOrder.length){
            //         throw new Error(`Another active order exists (user: ${memberId})!`)
            //     }
            // })
            
    
            
            //checking if order profiles match party
            const party = [leader.toString(), ...membersIds.map(member => member.toString())]
            let orderParty = [] 
            
            await asyncForEach(order, async (user) => {
                const memberId = user.profile
               
                orderParty = [...orderParty, memberId.toString()]
            })
    
            //console.log(orderParty, party)
            if(!isEqual(orderParty, party)) {
                throw Error('Invalid party!')
            }

            resolve(members)

        }catch(e){
            reject(e)
        }
        
    })
}

//OK
router.patch('/activate', auth, async (req, res)=> {

    const order = req.body.order
    const user = req.user

    try{
        //checking active order - user
        //TODO: should override last order?
        if(user.activeOrder.length){
            throw new Error(`Another active order exists (user: ${user._id})!`)
        }


        let membersIds = []
        let leader = null

        if(user.party){
            const party = await Party.findById(user.party)
            membersIds = [...party.members]
            leader = party.leader
        }else{
            leader = user._id
        }



        if(leader && (leader.toString() !== user._id.toString())){ //here are objectIDs - need to be string
            throw new Error('User is not the leader!')
        }
        const party = await verifyParty(leader, membersIds, order)
    

        user.activeOrder = order
        await user.save()


        await user.populate({ //populate after verification
            path: 'activeOrder.profile',
            select: "_id name avatar"
        }).populate({
            path: 'activeOrder.products.product',
            populate: {path: 'awards.itemModel'} //is necessary here?
        }).execPopulate()


        let modelPerks
        await asyncForEach(party, async (user) => {
           // const userPerks = user.userPerks
           // console.log(userPerks)
            //HERE IMPLEMENT PRICE AND EXPERIENCE MODS - input: activeOrder, userPerks; output: object for view
            modelPerks = await designateUserPerks(user)
 
        })



        //WORKING! AS COMMENT FOR TESTS
        /*
        setTimeout(async () => {
            user.activeOrder = []
            await user.save()
        }, 60*1000); //removing activeOrder after 60 seconds
        */

        res.send(order)

    }catch(e){
        res.status(400).send(e.message)
    }
})

//triggered by ADMIN 
//OK BUT TO DEVELOP
router.patch('/verify', auth, async (req, res) => {
    
    try{

        const party = await Party.findOne({
            'leader': req.body._id
        })

        let partyId = null
        let leader = null
        let membersIds = []

        if(party){
            partyId = party._id
            membersIds = [...party.members]
            leader = party.leader
        }else{
            leader = req.user._id
        }
        
        const user = await User.findOne({
            $and: [
                {_id: req.body._id},
                //{party: partyId},
                {'activeOrder': {$not: {$size: 0}}} //size does not accept ranges
            ]
        })

        if(!user){
            throw Error('Nie znaleziono użytkownika!')
        }
        if(partyId && !user.party){
            throw Error('Użytkownik nie należy do żadnej drużyny!')
        }
        
        const members = await verifyParty(leader, membersIds, user.activeOrder)


        await user.populate({ //populate after verification
            path: 'activeOrder.profile'
        }).populate({
            path: 'activeOrder.products.product',
            populate: {path: 'awards.itemModel'} //is necessary here?
        }).execPopulate()

        const activeOrder = user.activeOrder

        const partyFullObject = [user, ...members]

        //console.log(activeOrder)
        let modelPerks
        await asyncForEach(partyFullObject, async (user) => {
           // const userPerks = user.userPerks
           // console.log(userPerks)
            //HERE IMPLEMENT PRICE AND EXPERIENCE MODS - input: activeOrder, userPerks; output: object for view
            modelPerks =await designateUserPerks(user)
 
        })

        //create ArchiveOrder - save modified experience for users OR repeat function in 'finalize'

        res.send(modelPerks.products)
        
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
        //const order = await ArchiveOrder.findById(req.body.order)
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