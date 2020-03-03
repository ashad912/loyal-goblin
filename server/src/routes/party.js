import express from "express";
import { User } from "../models/user";
import { auth } from "../middleware/auth";
import { adminAuth } from '../middleware/adminAuth';
import { MissionInstance } from "../models/missionInstance";
import { Party } from "../models/party";
import { asyncForEach, removeMissionInstanceIfExits, validatePartyAndLeader, } from '../utils/methods'
import {pick} from 'lodash'

import _ from "lodash";
var ObjectId = require("mongoose").Types.ObjectId;

const router = new express.Router();



////ADMIN
router.get('/adminParties', adminAuth, async (req, res) => {
  try{
    const parties = await Party.find({}).sort({"createdAt": -1 }).populate({
      path: 'leader members',
      select: "_id name avatar active lastActivityDate experience"
    })

    res.send(parties)
  }catch(e){
    res.status(500).send(e)
  }
  
})


router.delete("/adminRemove", adminAuth, async (req, res) => {
 
  try {
    const party = await Party.findById(req.body._id);
    
    if (!party) {
      res.status(404).send();
    }

    await party.remove(); //look at middleware
    res.send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});


////USER

router.get("/", auth, async (req, res, next) => {
  const user = req.user;

  try {
    if (!user.party) {
      res.status(204).send(null);
      return;
    }

    await user
      .populate({
        path: "party",
        populate: {
          path: "leader members",
          select: "_id name avatar attributes experience userPerks equipped bag class experience",
          populate: {
            path: "bag",
            populate: {
              path: "itemModel",
              populate: {
                path: "perks.target.disc-product",
                select: "_id name"
              }
            }
          }
        }
      })
      .populate({
        path: "bag",
        populate: { path: "itemModel", select: '_id description appearanceSrc imgSrc name perks type twoHanded', populate: { path: "perks.target.disc-product", select: '_id name' } }
      })
      .execPopulate();
     
     for(let i=0; i<user.party.members.length; i++){
      user.party.members[i].equipped = pick(user.party.members[i].equipped, 'scroll')
      user.party.members[i].bag = user.party.members[i].bag.filter(item => {
        return item.itemModel.type === 'scroll'
      })
     }
     user.party.leader.equipped = pick(user.party.leader.equipped, 'scroll')


    res.send({party: user.party, bag: user.bag});
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

//Called when party leader names party and can qr-scan new members
router.post("/create", auth, async (req, res) => {
  //Leader is User model
  const leader = req.user;
  try {
    //Forbid party creation if user is in another party
    const oldParty = await Party.findOne({
      $or: [
        { leader: leader._id },
        { members: { $elemMatch: { $eq: leader._id } } }
      ]
    });

    if (oldParty) {
      throw new Error("User is in another party!");
    }

    if (leader.party) {
      const oldParty = await Party.findById(leader.party);
      if (oldParty) {
        throw new Error("User is in another party!");
      }
    }

    //Remove party's existing mission instance if present on user add
    await removeMissionInstanceIfExits(leader._id)
    

    //Create new party with name from request and leader from auth
    const party = new Party({ name: req.body.name, leader: leader._id });

    await party.save();
    leader.party = party._id;
    await leader.save();

    res.status(200).send({ partyId: party._id });
  } catch (e) {
    console.log(e.message)
    res.status(400).send(e.message);
  }
});

//Called when leader scans member qr-code
router.patch("/addMember", auth, async (req, res) => {
  try {
    const leader = req.user

    const party = await validatePartyAndLeader(leader, false);

    

    if(leader._id.toString() !== party.leader._id.toString()){ //ASHAD
      throw new Error('You are not the leader!')
    }

    if (party.members.length >= 7) {
      throw new Error("Maksymalna wielkość drużyny została osiągnięta!");
    }

    if (!ObjectId.isValid(req.body.memberId)) {
      throw new Error("Nieprawidłowy identyfikator użytkownika");
    }

    const user = await User.findById(req.body.memberId);
    if (user.party) {
      let errMssg = "";
      if (user.party === req.body.partyId) {
        errMssg = "Użytkownik jest już w tej drużynie!";
      } else {
        errMssg = "Użytkownik jest już w innej drużynie!";
      }

      throw new Error(errMssg);
    }

    await User.updateOne(
      { _id: req.body.memberId },
      { $set: { party: req.body.partyId } }
    );

    //Remove party's (and new user's) existing mission instance if present on user add
    const missionInstances = await MissionInstance.find({ //ASHAD MOD
      $or: [
        {party: { $elemMatch: { profile: leader._id } }}, //remove existing mInstance - party side
        {party: { $elemMatch: { profile: user._id } }} //remove existing mInstance - new user side
       ]
    });

    if (missionInstances.length) {
      await asyncForEach(missionInstances, async (missionInstance) => {
        missionInstance.remove();
      })  
    }

    party.members.push(req.body.memberId);
    //console.log(party.members);
    await party.save();
    await party
      .populate({
        path: "leader members",
        select: "_id name avatar bag attributes experience userPerks"
      })
      .execPopulate();
    //console.log(party);

    res.status(200).send(party);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

router.patch("/leader", auth, async (req, res) => {
  const leader = req.user
  try {
    if (!ObjectId.isValid(req.body.memberId)) {
      throw new Error("Nieprawidłowy identyfikator użytkownika");
    }

    await validatePartyAndLeader(leader, false);

    const user = await User.findById(req.body.memberId);

    if (!user.party) {
      throw new Error("Użytkownik nie należy do żadnej drużyny");
    }

    if (req.user.party.toString() !== user.party.toString()) {
      throw new Error(
        "Aktualny lider i użytkownik nie należą do tej samej drużyny"
      );
    }

    if (user.party.toString() !== req.body.partyId) {
      throw new Error(
        "Użytkownik nie należy do drużyny, z której otrzymuje stanowisko lidera"
      );
    }

    await Party.updateOne(
      { _id: req.body.partyId },
      { $set: { "members.$[elem]": leader._id, leader: req.body.memberId } },
      { arrayFilters: [{ elem: { $eq: req.body.memberId } }], multi: false }
    );

    //party.leader = req.body.memberId;


    //Remove party's existing mission instance if present on user add
    await removeMissionInstanceIfExits(user._id)

    const party = await Party.findById(req.body.partyId)
    await party
      .populate({
        path: "leader members",
        select: "_id name avatar bag attributes experience userPerks"
      })
      .execPopulate();

    res.status(200).send(party);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

//Called when party member leaves party
//TODO: Send info to party members and leader
router.patch("/leave", auth, async (req, res) => {
  try {
    let party = await Party.findById(req.body.partyId);

    if (req.body.memberId === party.leader.toString()) {
      throw new Error("Leader cannot leave the party!");
    }

    party.members.pull({ _id: req.body.memberId });
    await party.save();

    //Set leaving user party to null
    await User.updateOne({ _id: req.body.memberId }, { $set: { party: null } });

    //Remove party's existing mission instance if present on user leave
    await removeMissionInstanceIfExits(req.body.memberId)

    await party
      .populate({
        path: "leader members",
        select: "_id name avatar"
      })
      .execPopulate();

    if (req.body.memberId !== req.user._id.toString()) {
      res.status(200).send(party); //send by leader to drop a member
    } else {
      res.send(null); //send by member to leave - clean redux
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});


//Called when leader deletes party
//TODO: Send info to members about party removal
router.delete("/remove", auth, async (req, res) => {
  const user = req.user;

  try {
    const party = await validatePartyAndLeader(user);;

    // if (!party) {
    //   throw new Error("No party!");
    // }

    // if (user._id.toString() !== party.leader.toString()) {
    //   throw new Error("You are not the leader!");
    // }


    await party.remove(); //look at middleware
    res.send(party);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export const partyRouter = router;
