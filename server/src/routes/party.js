import express from "express";
import mongoose from 'mongoose'
import { User } from "@models/user";
import { auth } from "@middleware/auth";
import { adminAuth } from '@middleware/adminAuth';
import { MissionInstance } from "@models/missionInstance";
import { Party } from "@models/party";
import { asyncForEach } from '@utils/functions'
import { pick } from 'lodash'

import _ from "lodash";
import { getEndpointError } from "@utils/functions";
import { ERROR, WARN, INFO } from '@utils/constants'

const ObjectId = mongoose.Types.ObjectId;

const router = new express.Router();



////ADMIN
router.get('/adminParties', adminAuth, async (req, res, next) => {
  try {
    const parties = await Party
      .find({}).sort({ "createdAt": -1 })
      .selectPopulate("_id name avatar active lastActivityDate experience")
    // .populate({
    //   path: 'leader members',
    //   select: "_id name avatar active lastActivityDate experience"
    // })

    res.send(parties)
  } catch (e) {
    next(e)
  }

})


router.delete("/adminRemove", adminAuth, async (req, res, next) => {

  try {
    const party = await Party.findById(req.body._id);

    if (!party) {
      res.status(404).send();
    }

    await party.remove(); //look at middleware
    res.send();
  } catch (e) {
    next(e)
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
      .partyPopulate()
      .bagPopulate()
      .execPopulate();

    // ??
    for (let i = 0; i < user.party.members.length; i++) {
      user.party.members[i].equipped = pick(user.party.members[i].equipped, 'scroll')
      user.party.members[i].bag = user.party.members[i].bag.filter(item => {
        return item.itemModel.type === 'scroll'
      })
    }
    user.party.leader.equipped = pick(user.party.leader.equipped, 'scroll')


    res.send({ party: user.party, bag: user.bag });
  } catch (e) {
    next(e)
  }
});

//Called when party leader names party and can qr-scan new members
router.post("/create", auth, async (req, res, next) => {
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
      throw getEndpointError(WARN, 'User is in another party', leader._id)
    }

    if (leader.party) {
      const oldParty = await Party.findById(leader.party);
      if (oldParty) {
        throw getEndpointError(WARN, 'User is in another party', leader._id)
      }
    }

    //Remove party's existing mission instance if present on user add
    await MissionInstance.removeIfExists(leader._id)

    //Remove user active order
    if (leader.activeOrder.length) await leader.clearActiveOrder()



    //Create new party with name from request and leader from auth
    const party = new Party({ name: req.body.name, leader: leader._id });

    await party.save();

    await party
      .selectPopulate("_id name avatar bag attributes userPerks class experience activeOrder")
      .execPopulate();
    leader.party = party._id;
    await leader.save();

    res.status(200).send(party);
  } catch (e) {
    next(e)
  }
});

//Called when leader scans member qr-code
router.patch("/addMember", auth, async (req, res, next) => {
  try {
    const leader = req.user

    const party = await leader.validatePartyAndLeader(false);


    if (party.members.length >= 7) {
      throw getEndpointError(WARN, 'Maximum size of party is reached', leader._id)
    }

    if (!ObjectId.isValid(req.body.memberId)) {
      throw getEndpointError(WARN, 'Invalid user ID', leader._id)
    }

    const newMember = await User.findOne({ _id: req.body.memberId });
    if (newMember.party) {
      let errMssg = "";
      if (newMember.party === party._id) {
        errMssg = "User has already been in the party";
      } else {
        errMssg = "User belongs to other party";
      }

      throw getEndpointError(WARN, errMssg, leader._id)

    }

    //Set the party field and remove active order
    newMember.party = party._id
    if (newMember.activeOrder.length) await newMember.clearActiveOrder()

    await newMember.save()


    //Remove leader active order
    if (leader.activeOrder.length) await leader.clearActiveOrder()

    //Remove party's (and new user's) existing mission instance if present on user add
    const missionInstances = await MissionInstance.find({ //ASHAD MOD
      $or: [
        { party: { $elemMatch: { profile: leader._id } } }, //remove existing mInstance - party side
        { party: { $elemMatch: { profile: newMember._id } } } //remove existing mInstance - new user side
      ]
    });

    if (missionInstances.length) {
      await asyncForEach(missionInstances, async (missionInstance) => {
        missionInstance.remove();
      })
      //update missions -> function for getMissionList
    }

    party.members.push(req.body.memberId);
    //console.log(party.members);
    await party.save();
    await party
      .selectPopulate("_id name avatar bag attributes userPerks class experience activeOrder")
      .execPopulate();
    //console.log(party);

    res.status(200).send(party);
  } catch (e) {
    next(e)
  }
});

router.patch("/leader", auth, async (req, res, next) => {
  const leader = req.user
  try {
    if (!ObjectId.isValid(req.body.memberId)) {
      throw getEndpointError(WARN, 'Invalid user ID', leader._id)
    }

    await leader.validatePartyAndLeader(false);

    const user = await User.findById(req.body.memberId);

    if (!user.party) {
      throw getEndpointError(WARN, 'User has no valid party field', leader._id)
    }

    if (req.user.party.toString() !== user.party.toString()) {
      throw getEndpointError(WARN, "Current leader and user are not in the same party", leader._id)
    }

    if (user.party.toString() !== req.body.partyId) {
      throw getEndpointError(WARN, "User does not belong to apprioprate party", leader._id)
    }

    await Party.updateOne(
      { _id: req.body.partyId },
      { $set: { "members.$[elem]": leader._id, leader: req.body.memberId } },
      { arrayFilters: [{ elem: { $eq: req.body.memberId } }], multi: false }
    );

    //party.leader = req.body.memberId;


    //Remove party's existing mission instance if present on user add
    await MissionInstance.removeIfExists(user._id)

    //Remove leader active order
    if (leader.activeOrder.length) await leader.clearActiveOrder()

    const party = await Party.findById(req.body.partyId)
    await party
      .selectPopulate("_id name avatar bag attributes experience userPerks class experience activeOrder")
      .execPopulate();

    res.status(200).send(party);
  } catch (e) {
    next(e)
  }
});

//Called when party member leaves party
//TODO: Send info to party members and leader
router.patch("/leave", auth, async (req, res, next) => {
  const leader = req.user
  try {
    let party = await Party.findById(req.body.partyId);

    if (req.body.memberId === party.leader.toString()) {
      throw getEndpointError(WARN, "Leader cannot leave the party", leader._id)
    }

    party.members.pull({ _id: req.body.memberId });
    await party.save();

    //Set leaving user party to null
    await User.updateOne({ _id: req.body.memberId }, { $set: { party: null } });

    //Remove party's existing mission instance if present on user leave
    await MissionInstance.removeIfExists(req.body.memberId)



    await party
      .selectPopulate("_id name avatar activeOrder")
      .execPopulate();

    //Remove leader active order
    if (party.leader.activeOrder.length) {
      // const leader = await User.findById(party.leader._id)
      // await leader.clearActiveOrder()
      await party.leader.clearActiveOrder()
    }

    if (req.body.memberId !== req.user._id.toString()) {
      res.status(200).send(party); //send by leader to drop a member
    } else {
      res.send(null); //send by member to leave - clean redux
    }
  } catch (e) {
    next(e)
  }
});


//Called when leader deletes party
//TODO: Send info to members about party removal
router.delete("/remove", auth, async (req, res, next) => {
  const leader = req.user;

  try {
    const party = await leader.validatePartyAndLeader();

    //Remove leader active order
    if (leader.activeOrder.length) await leader.clearActiveOrder()

    await party.remove(); //look at middleware
    res.send(party);
  } catch (e) {
    next(e)
  }
});

export const partyRouter = router;
