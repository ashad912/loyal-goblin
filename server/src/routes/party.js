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

//OK, TO DEVELOP - ALMOST RAW API
router.post('/create', auth, async (req,res) => {
    const party = new Party(req.body)

    
    try {

        await party.save() 

        const allInPartyIds = [party.leader, ...party.members]

        await User.updateMany({
            _id: {$in: allInPartyIds}
        },{
            $set: {
                party: party._id
            }
        })

        res.status(201).send(party)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

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