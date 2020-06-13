import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import moment from 'moment'
import {Item} from './item'
import {Party} from './party'
import {Rally} from './rally'
import {OrderExpiredEvent} from './orderExpiredEvent'
import {ProductsOrderSchema} from '@schemas/ProductsOrderSchema'
import {ClassAwardsSchema} from '@schemas/ClassAwardsSchema'
import {LoyalSchema} from '@schemas/LoyalSchema'

import arrayUniquePlugin from 'mongoose-unique-array'
import { asyncForEach} from '@utils/functions'
import { levelingEquation } from "@utils/constants";

import userStore from '@store/user.store'

export const userClasses = ['warrior', 'mage', 'rogue', 'cleric']

export const userSexes = ['male', 'female']

export const UserSchema = new mongoose.Schema({
    
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    passwordChangeToken: {
        type: String
    },
    active: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
    },
    avatar: {
        type: String
    },
    lastActivityDate: {
        type: Date,
    },
    name: {
        type: String,
    },
    sex : {
        type: String,
    },
    class: { //userClasses
        type: String,
    },
    attributes: {
        strength: {
            type: Number,
            default: 0,
        },
        dexterity: {
            type: Number,
            default: 0,
        }, 
        magic: {
            type: Number,
            default: 0,
        },
        endurance: {
            type: Number,
            default: 0,
        },
    },
    experience: {
        type: Number,
        default: 0,
        min: 0,
        validate(value) {
            if (!Number.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        },
    },
    bag: {
        type: [{  //for plugin proper work - bag field is required while user is being created
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
        }],
        required: true,
    },
    equipped: {
        weaponRight: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        weaponLeft: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        chest: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        }
        ,
        legs: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        }
        ,
        hands: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        feet: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        head: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
           // unique: true,
            default: null
        },
        ringRight: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        ringLeft: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        hands: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        scroll: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        torpedo: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
    },
    loyal: {
        type: LoyalSchema,
        required: true
    },
    party: { //suggested struct - EXPERIMENTAL
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'party',
        default: null      
    },
    activeOrder: [{
        profile: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user',
        },
        products: [ProductsOrderSchema],
        price: {type: Number, default: 0},
        experience: {type: Number, default: 0},
        awards: [{quantity: {type: Number, default: 0 }, itemModel: {type: mongoose.Schema.Types.ObjectId, ref: 'itemModel'}}],
        createdAt: {type: Date}
    }],
    statistics: {
        missionCounter: {
            type: Number,
            default: 0,
            min: 0,
            
        },
        rallyCounter: {
            type: Number,
            default: 0,
            min: 0,
            
        },
        amuletCounters: [{
            counter: {
                type: Number,
                required: true,
            },
            amulet: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'itemModel',
            }
        }]

    },
    rallyNotifications: {
        isNew: {
            type: Boolean, 
            default: false,
        },
        experience: {
            type: Number,
            default: 0,
            min: 0,
            validate(value) {
                if (!Number.isInteger(value)) {
                    throw new Error(`${value} is not an integer value!`)
                }
            },
        },
        awards: [ClassAwardsSchema],
    },
    shopNotifications: {
        isNew: {
            type: Boolean, 
            default: false,
        },
        experience: {
            type: Number,
            default: 0,
            min: 0,
            validate(value) {
                if (!Number.isInteger(value)) {
                    throw new Error(`${value} is not an integer value!`)
                }
            },
        },
        awards: [ClassAwardsSchema],
    },
    levelNotifications: {
        type: Number,
        default: 0,
        min: 0,
        validate(value) {
            if (!Number.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        },
    },
    perksUpdatedAt: Date,
    userPerks: {
        attrStrength: {
            type: Number,
            default: 0,
            validate(value) {
                if (!Number.isInteger(value)) {
                    throw new Error(`${value} is not an integer value!`)
                }
            },
        },
        attrDexterity: {
            type: Number,
            default: 0,
            validate(value) {
                if (!Number.isInteger(value)) {
                    throw new Error(`${value} is not an integer value!`)
                }
            },
        },
        attrMagic: {
            type: Number,
            default: 0,
            validate(value) {
                if (!Number.isInteger(value)) {
                    throw new Error(`${value} is not an integer value!`)
                }
            },
        },
        attrEndurance: {
            type: Number,
            default: 0,
            validate(value) {
                if (!Number.isInteger(value)) {
                    throw new Error(`${value} is not an integer value!`)
                }
            },
        },
        rawExperience: {
            absolute: {
                type: String,
                default: '0',
            },
            percent: {
                type: String,
                default: '0%',
            }
        },
        products: { //important change! [] -> {}
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    }
    
}, {
    minimize: false, //to save {} as default
    timestamps: true
})

// UserSchema.virtual('missions', { //events can be reached by relations, BI RELATION!!
//     ref: 'mission',
//     localField: '_id', //relation from user side (we are in user schema!)
//     foreignField: 'completedByUsers.user' //relation from event side
// })

//it is recognized as an array
UserSchema.virtual('activeMission', { //events can be reached by relations, BI RELATION!!
    ref: 'missionInstance',
    localField: '_id', //relation from user side (we are in user schema!)
    foreignField: 'party.profile' //relation from event side
})

UserSchema.virtual('userRallies', { //events can be reached by relations, BI RELATION!!
    ref: 'rally',
    localField: '_id', //relation from user side (we are in user schema!)
    foreignField: 'users.profile' //relation from event side
})



UserSchema.methods.generateAuthToken = async function () { //on instances
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token: token})
    await user.save()

    return token
}

UserSchema.methods.generatePasswordResetToken = async function () { //on instances
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, { expiresIn: '1h' })

    user.passwordChangeToken = token
    await user.save()

    return token
}

UserSchema.methods.updatePassword = async function(oldPassword, newPassword) {
    const user = this;
  
    return new Promise((resolve, reject) => {
      bcrypt.compare(oldPassword, user.password, (err, res) => {
        if (res) {
          user.password = newPassword
  
          resolve(user);
        } else {
          reject();
        }
      });
    });
}

UserSchema.methods.clearActiveOrder = async function () {
    const user = this
    user.activeOrder = []
    await user.save()

    if(process.env.REPLICA === "true"){
        const orderExpiredEvent = await OrderExpiredEvent.findById(user._id)

        if(orderExpiredEvent){
            await orderExpiredEvent.remove()
        }
    }
    

    return 

}

UserSchema.methods.updateActivityDate = async function (query) {
    const user = this
    const autoFetch = query && query.autoFetch && ((new Date().getTime() % 3600000) < 5000) //verify autoFetch query (available to 5 seconds after start of hour)
            
    if(!autoFetch){
        let sub
        if(user.lastActivityDate){
            sub = moment().valueOf() - moment(user.lastActivityDate).valueOf()
        }
        if(!user.lastActivityDate || (sub && sub >= 60 * 1000)){ //1 min db field refresh
            user.lastActivityDate = moment().toISOString()
            await user.save()
        }
    }
}

UserSchema.methods.toJSON = function () { //like a middleware from express, we can use it with everythin
    const user = this
    const userObject = user.toObject() //thanks userObject we can manipulate data inside
    
    delete userObject.email
    delete userObject.password
    delete userObject.tokens

    return userObject
}

UserSchema.methods.checkPasswordChangeTokenExpired = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err && err.message === 'jwt expired'){
            return true
        }else{
            return false
        }
    })
   
}

UserSchema.methods.bagPopulate = function(){
    return this.populate({
            path: "bag",
            populate: { 
                path: "itemModel", 
                select: '_id description imgSrc appearanceSrc altAppearanceSrc name perks type twoHanded', 
                populate: { 
                    path: "perks.target.disc-product", 
                    select: '_id name'
                } 
            }
    })
    
}




UserSchema.methods.standardPopulate = async function(){
    const user = this
    await user
        .bagPopulate()
        .populate({
            path: "statistics.amuletCounters.amulet",
            select: '_id imgSrc name'
        })
        .populate({
            path: "rallyNotifications.awards.itemModel",
            select: '_id description imgSrc name perks',
            populate: { path: "perks.target.disc-product", select: '_id name' },
        })
        .populate({
            path: "shopNotifications.awards.itemModel",
            select: '_id description imgSrc name perks',
            populate: { path: "perks.target.disc-product", select: '_id name' },
        })
        .execPopulate()

    // if(user.statistics.amuletCounters && user.statistics.amuletCounters.length){
    //     await user
    //     .populate({
    //         path: "statistics.amuletCounters.amulet",
    //         select: '_id imgSrc name'
    //     })
    //     .execPopulate();
    // }
    // // if (user.rallyNotifications.awards && user.rallyNotifications.awards.length) {
    //     await user
    //     .populate({
    //         path: "rallyNotifications.awards.itemModel",
    //         select: '_id description imgSrc name perks',
    //         populate: { path: "perks.target.disc-product", select: '_id name' },
    //     })
    //     .execPopulate();
    // // }
    // if (user.shopNotifications.awards && user.shopNotifications.awards.length) {
    //     await user
    //     .populate({
    //         path: "shopNotifications.awards.itemModel",
    //         select: '_id description imgSrc name perks',
    //         populate: { path: "perks.target.disc-product", select: '_id name' },
    //     })
    //     .execPopulate();
    // }

}

UserSchema.methods.partyPopulate = function () {
    return this.populate({
        path: "party",
        populate: {
            path: "leader members",
            select: "_id name avatar attributes experience userPerks equipped bag class experience activeOrder",
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
}

UserSchema.methods.orderPopulate = async function () {
    await this
        .populate({
        //populate after verification
            path: "activeOrder.profile",
            select: "_id name avatar"
        })
        .populate({
            path: "activeOrder.products.product",
            populate: {
                path: "awards.itemModel",
                populate: { path: "perks.target.disc-product", select: "_id name" }
            }
        })
        .populate({
            path: "activeOrder.awards.itemModel", 
            select: "name imgSrc description"
        })
        .execPopulate();
}

UserSchema.methods.getNewLevels = function(newExp){
    if(typeof newExp !== 'number' || newExp < 0){
      throw new Error('Invalid first param!')
    }
  
    const levelsData = this.getLevel(newExp)
    return levelsData.newLevel - levelsData.oldLevel
    
}

UserSchema.methods.getLevel = function(addPoints){

    const user = this
    const points = user.experience

    const {a, b, pow} = levelingEquation;

    let previousThreshold = 0;
    let oldLevel;
    for (let i = 1; i <= 1000; i++) {
        const bottomThreshold = previousThreshold;
        const topThreshold = previousThreshold + (a * i ** pow + b);

        if (points >= bottomThreshold && points < topThreshold) {
            if(addPoints === undefined){
                return i
            }
            oldLevel = i
        }

        if(addPoints >= 0 && points + addPoints >= bottomThreshold && points + addPoints < topThreshold){
            return {oldLevel, newLevel: i}
        }
        previousThreshold = topThreshold;
    }

    return 1000
}

UserSchema.methods.validatePartyAndLeader = function(inShop){
    const user = this
    return new Promise (async (resolve, reject) => {
        try{
          
          const party = inShop !== undefined
            ? (await Party.findOne({inShop: inShop, _id: user.party, leader: user._id}))
            : (await Party.findOne({_id: user.party, leader: user._id}))
          
          if(!party){
            throw new Error('Invalid party conditions!')
          }
          
          resolve(party)
        }catch(e){
          reject(e)
        }
    })
}

UserSchema.methods.updatePerks = async function(forcing, withoutParty){
    //'forcing' - update without checking perksUpdatedAt
    const user = this
    
    
    try {
        if (forcing || user.isNeedToPerksUpdate()) {
            user.userPerks = await userStore.computePerks(user);
            user.perksUpdatedAt = moment().toISOString(); //always in utc
            await user.save();
        }

        if (user.party && !withoutParty) {
            //party perks updating
            const partyObject = await Party.findById(user.party);
            let party = [partyObject.leader, ...partyObject.members].filter(
            memberId => {
                //exclude 'req.user' and nulls
                return memberId && memberId.toString() !== user._id.toString();
            }
            );

            if (party.length) {
                await asyncForEach(party, async memberId => {
                    const member = await User.findById(memberId);

                    if (!member) {
                        throw Error(`Member (${memberId}) does not exist!`);
                    }

                    if (forcing || member.isNeedToPerksUpdate()) {
                        member.perks = await userStore.computePerks(member);
                        member.perksUpdatedAt = moment().toISOString(); //always in utc
                        await member.save();
                    }
                });
            }
        }
        
        return user.userPerks;
    } catch (e) {
        throw e;
    }
    
}

UserSchema.methods.isNeedToPerksUpdate = function(){
    const user = this

    if (user.perksUpdatedAt && user.perksUpdatedAt instanceof Date) {
      const lastUpdateDate = moment.utc(user.perksUpdatedAt);
      const now = moment.utc();

  
      let lastUpdateHour = lastUpdateDate.hour();
      if (lastUpdateDate.minutes() === 0 && lastUpdateDate.seconds() === 0) {
        //very rare super equal hour update
        lastUpdateHour -= 1;
      }
  
      const nextUpdateDate = moment.utc(
        `${lastUpdateDate.year()}-${lastUpdateDate.month()+1}-${lastUpdateDate.date()} ${lastUpdateHour + 1}:00:01`,
        "YYYY-MM-DD HH:mm:ss"
      );
      
  
      if (now.valueOf() >= nextUpdateDate.valueOf()) {
        return true;
      }
  
      return false;
    }
};

UserSchema.methods.calculateOrder = async function(){
    return await userStore.calculateOrder(this)
}


UserSchema.statics.clear = async () => {
    const users = await User.find({})
    await asyncForEach(users, async (user) => {
      await user.remove()
    })
}

UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( {email: email, active: true})
    

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }
    

    return user
}

UserSchema.statics.findByPasswordChangeToken = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne( {_id: decoded._id, active: true, passwordChangeToken: token})
    if(!user) {
        throw new Error('Nie znaleziono użytkownika')
    }
    return user
}



UserSchema.pre('save', async function(next){//middleware, working with static User.create!!

    const user = this

    if(user.isModified('password')){ //mongoose method
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()

})




//OK!
UserSchema.pre('remove', async function(next){
    const user = this

    const items = await Item.find({owner: user._id}) //if deleteMany runs remove middleware? -> NO

    await asyncForEach((items), async item => {
        await item.remove() //running 'pre remove' instance middleware
    })
    //await Item.deleteMany({owner: user._id})
   

    const party = await Party.findById(user.party)

    if(party){
        await party.remove()
    }
    
    

    //what else - rally
    await Rally.updateMany(
        {"$and": [
            { users: { $elemMatch: {profile:  user._id}}}, //wihout eq
            { $and: [{ activationDate: { $lte: new Date() } }, {expiryDate: { $gte: new Date() } }]},
        ]},
        {$pull: {
            "users": {profile: user._id}
        }}
    )

    
    

    next()
})


UserSchema.plugin(arrayUniquePlugin)


export const User = new mongoose.model('user', UserSchema)