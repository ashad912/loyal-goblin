import express from 'express'
import bcrypt from 'bcryptjs'
import { Event } from '../models/event';
import { auth } from '../middleware/auth';


const router = new express.Router

//CHECK:
// - working
// - no amulets
// - no party
//assumed, when user finishes the mission, mission saves his id in array
router.get('/events', auth, async (req, res) => { //get active events which are available for specific user AND for all user's party!!
    
    const user = req.user;

    let partyIds = []

    if(user.party) {
        partyIds = [user.party.leader, ...user.party.members]
    }

    
    try {
        const events = await Event.find({status: 'active', users: {$elemMatch: {$nin: partyIds}}}).populate({ //https://stackoverflow.com/questions/22518867/mongodb-querying-array-field-with-exclusion
            path: 'amulets.amulet.itemModel',
            options: {}
        }).execPopulate() //get active events which are available for specific user AND for all user's party with populating idreferences to required amulets
        
        res.send(events)
    } catch (e) {
        res.status(500).send()
    }
})


export const eventRouter = router