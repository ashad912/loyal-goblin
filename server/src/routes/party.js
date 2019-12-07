import express from 'express'
import { User } from '../models/user';
import { Mission } from '../models/mission';
import { auth } from '../middleware/auth';
import { MissionInstance } from '../models/missionInstance';
import { Item } from '../models/item'
import { ItemModel } from '../models/itemModel'
import { asyncForEach, designateUserPerks, isNeedToPerksUpdate, designateUserLevel } from '../utils/methods'

import isEqual from 'lodash/isEqual'
import moment from 'moment'
import {Rally} from '../models/rally'
import { Party } from '../models/party';


const router = new express.Router



//Called when party leader names party and can qr-scan new members
router.post('/create', auth, async(req, res) => {
  const leader = req.user
  //Remove old party if leader creates new one
  if(leader.party){
    try {
      const oldParty = await Party.findById(leader.party._id)
      if(oldParty.leader.toString() === leader._id.toString()){
        await oldParty.remove()
      }
    } catch (e) {
      console.log(e)
      res.sendStatus(400)
    }}
  
  const party = new Party({...req.body, leader: leader._id})

  try {
    await party.save()
    leader.party = party._id
    await leader.save()

    res.status(200).send({partyId: party._id})
  } catch (e) {
    
    res.status(400).send(e.message)
  }

})

//Called when leader scans member qr-code
router.patch('/addMember', auth, async (req, res) => {
  try {
    const party = await Party.findById(req.body.partyId)
    party.members.push(req.body.memberId)
    await party.save()
    
    await User.updateOne({_id: req.body.memberId}, {$set: {party: req.body.partyId}})

    res.status(201).send(party)

    
  } catch (e) {
    console.log(e)
    res.sendStatus(400)
  }
})









//OK, TO DEVELOP - ALMOST RAW API
// router.post('/create', auth, async (req,res) => {
//     const party = new Party(req.body)

    
//     try {

//         await party.save() 

//         const allInPartyIds = [party.leader, ...party.members]

//         await User.updateMany({
//             _id: {$in: allInPartyIds}
//         },{
//             $set: {
//                 party: party._id
//             }
//         })

//         res.status(201).send(party)
//     } catch (e) {
//         res.status(500).send(e.message)
//     }
// })

//user leaves party -> remove missionInstance!

//OK
router.patch('/remove', auth, async (req, res) => {
    const user = req.user
  
    try{

      const party = await Party.findById(req.body._id)

      if(!party){
        throw new Error('No party!')
      }
    
      if(user._id.toString() !== party.leader.toString()){
        throw new Error('You are not the leader!')
      }
  
      await party.remove() //look at middleware

      res.send()
    }catch(e){
      res.status(400).send(e.message)
    }
      
})

export const partyRouter = router;