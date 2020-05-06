import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import moment from 'moment'
import {Item} from './item'
import {Party} from './party'
import {Rally} from './rally'
import {OrderExpiredEvent} from './orderExpiredEvent'
import {ProductsOrderSchema} from '../schemas/ProductsOrderSchema'
import {ClassAwardsSchema} from '../schemas/ClassAwardsSchema'
import {LoyalSchema} from '../schemas/LoyalSchema'

import arrayUniquePlugin from 'mongoose-unique-array'
import { asyncForEach, designateUserPerks } from '../utils/methods'

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


UserSchema.methods.standardPopulate = async function(){
    const user = this

    await user
        .populate({
            path: "bag",
            populate: { path: "itemModel", select: '_id description imgSrc appearanceSrc name perks type twoHanded', populate: { path: "perks.target.disc-product", select: '_id name' } }
        })
        .execPopulate();
    if(user.statistics.amuletCounters && user.statistics.amuletCounters.length){
        await user
        .populate({
            path: "statistics.amuletCounters.amulet",
            select: '_id imgSrc name'
        })
        .execPopulate();
    }
    if (user.rallyNotifications.awards && user.rallyNotifications.awards.length) {
        await user
        .populate({
            path: "rallyNotifications.awards.itemModel",
            select: '_id description imgSrc name perks',
            populate: { path: "perks.target.disc-product", select: '_id name' },
        })
        .execPopulate();
    }
    if (user.shopNotifications.awards && user.shopNotifications.awards.length) {
        await user
        .populate({
            path: "shopNotifications.awards.itemModel",
            select: '_id description imgSrc name perks',
            populate: { path: "perks.target.disc-product", select: '_id name' },
        })
        .execPopulate();
    }

    //return user; 
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
    return new Promise(async (resolve, reject) => {
        try {
            if (forcing || user.isNeedToPerksUpdate()) {
                await user.computePerks();
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

                        if (forcing  || member.isNeedToPerksUpdate()) {
                            await member.computePerks();
                            member.perksUpdatedAt = moment().toISOString(); //always in utc
                            await member.save();
                        }
                    });
                }
            }

            resolve(user.userPerks);
        } catch (e) {
            reject(e);
        }
    });
}

UserSchema.methods.isNeedToPerksUpdate = function(){
    const user = this

    if (user.perksUpdatedAt && user.perksUpdatedAt instanceof Date) {
      const lastUpdateDate = moment.utc(user.perksUpdatedAt);
  
      let lastUpdateHour = lastUpdateDate.hour();
      if (lastUpdateDate.minutes() === 0 && lastUpdateDate.seconds() === 0) {
        //very rare super equal hour update
        lastUpdateHour -= 1;
      }
  
      const nextUpdateDate = moment.utc(
        `${lastUpdateHour + 1}:00:01`,
        "HH:mm:ss"
      );
      const now = moment.utc();
  
      if (now.valueOf() >= nextUpdateDate.valueOf()) {
        return true;
      }
  
      return false;
    }
};

UserSchema.methods.computePerks = function(){
    const user = this
    return new Promise(async (resolve, reject) => {
        try {
            await asyncForEach(Object.keys(user.equipped), async slot => {
                await user
                .populate({
                    path: "equipped." + slot,
                    populate: { path: "itemModel" }
                })
                .execPopulate();
            });
        
            const equippedItemsRaw = user.equipped;
        
            const equippedItems = equippedItemsRaw.toObject(); //to behave like normal JS object: delete, hasOwnProperty
        
            //console.log(equippedItems)
        
            const products = await Product.find({});
        
            const modelPerks = {
                attrStrength: 0,
                attrDexterity: 0,
                attrMagic: 0,
                attrEndurance: 0,
                rawExperience: {
                absolute: "0",
                percent: "0%"
                },
                products: {}
            };
        
            const isTime = timeArray => {
                if (!timeArray.length) {
                return true;
                }
                var nowDay = moment().day();
        
                for (let i = 0; i < timeArray.length; i++) {
                const time = timeArray[i];
        
                moment.locale("pl");
                let startTimeLocale = moment(`${time.startHour}:00`, "HH:mm");
                let endTimeLocale = moment(startTimeLocale)
                    .clone()
                    .add(time.lengthInHours, "hours");
                // console.log(
                //   "Local hours:",
                //   startTimeLocale.hour(),
                //   endTimeLocale.hour()
                // );
        
                let startTime = moment.utc(startTimeLocale);
                let endTime = moment.utc(endTimeLocale);
                //console.log("UTC hours:", startTime.hour(), endTime.hour());
                //console.log(startTime, endTime)
                //console.log(time.startDay, nowDay)
                if (time.startDay === nowDay) {
                    if (startTime.isBefore(endTime)) {
                    //console.log('before midnight')
                    let isTime = moment
                        .utc()
                        .isBetween(startTime, endTime, null, "[]");
                    //console.log(isTime)
                    if (isTime) {
                        return true;
                    }
                    }
                } else if (time.startDay + 1 === nowDay) {
                    if (startTime.hour >= endTime.hour) {
                    //console.log('after midnight')
                    let startTimeMinusDay = startTime.clone().subtract(1, "d");
                    let endTimeMinusDay = endTime.clone().subtract(1, "d");
                    //console.log(startTimeMinusDay, endTimeMinusDay)
                    let isTime = moment
                        .utc()
                        .isBetween(startTimeMinusDay, endTimeMinusDay, null, "[]");
                    //console.log(isTime)
                    if (isTime) {
                        return true;
                    }
                    }
                }
                }
        
                return false;
            };
        
            const truncCurrency = value => {
                return Math.trunc(100 * value) / 100;
            };
        
            const countValue = (source, perkValue, isCurrency, onlyDiscount) => {
                let result = 0;
        
                if (perkValue.includes("%")) {
                const tempDiscount = parseFloat(perkValue) / 100;
                if (isCurrency) {
                    const discount = truncCurrency(tempDiscount * source);
                    result = discount;
                } else {
                    const mod = Math.trunc(tempDiscount * source);
                    result = mod;
                }
        
                //console.log(result)
                } else {
                perkValue = parseFloat(perkValue);
                if (isCurrency) {
                    perkValue = truncCurrency(perkValue);
                } else {
                    perkValue = Math.trunc(perkValue);
                }
        
                result = perkValue;
                //console.log(result)
                }
        
                return result;
            };
        
            const countRawExperience = (exp, perkValue) => {
                if (perkValue.includes("%")) {
                perkValue = truncCurrency(parseFloat(perkValue));
                exp.percent = `${parseFloat(exp.percent) + perkValue}%`;
        
                //console.log(exp.percent)
                } else {
                perkValue = truncCurrency(parseFloat(perkValue));
                exp.absolute = `${parseFloat(exp.absolute) + perkValue}`;
                }
        
                return exp;
            };
        
            Object.keys(equippedItems).forEach((itemKey, index) => {
                if (
                equippedItems[itemKey] &&
                equippedItems[itemKey].hasOwnProperty("itemModel") &&
                equippedItems[itemKey].itemModel.hasOwnProperty("perks") &&
                equippedItems[itemKey].itemModel.perks &&
                equippedItems[itemKey].itemModel.perks.length > 0
                ) {
                const perks = equippedItems[itemKey].itemModel.perks;
                //console.log(perks)
                perks.forEach(perk => {
                    // console.log(perk.perkType)
                    if (isTime(perk.time)) {
                    switch (perk.perkType) {
                        case "attr-strength":
                            modelPerks.attrStrength =
                                modelPerks.attrStrength +
                                countValue(user.strength, perk.value, false);
                        break;
                        case "attr-dexterity":
                            modelPerks.attrDexterity =
                                modelPerks.attrDexterity +
                                countValue(user.dexterity, perk.value, false);
                        break;
                        case "attr-magic":
                            modelPerks.attrMagic =
                                modelPerks.attrMagic +
                                countValue(user.magic, perk.value, false);
                        break;
                        case "attr-endurance":
                            modelPerks.attrEndurance =
                                modelPerks.attrEndurance +
                                countValue(user.endurance, perk.value, false);
                        break;
                        case "experience":
                            modelPerks.rawExperience = countRawExperience(
                                modelPerks.rawExperience,
                                perk.value
                            );
                        // console.log(modelPerks)
                        break;
                        case "disc-product":
                            const product = products.find(product => {
                                return product._id.toString() === perk.target['disc-product']._id.toString();
                            });
        
                            if (product) {
                                const priceMod = (-1) * countValue( //to get discount
                                product.price,
                                perk.value, 
                                true
                                );
                                if(equippedItems[itemKey].itemModel.type === "scroll"){
                                    if (!modelPerks.products.hasOwnProperty(product._id)) {
                                        modelPerks.products[product._id] = {priceMod: {first: priceMod, standard: 0 }};
                                    } else if (!modelPerks.products[product._id].hasOwnProperty("priceMod")) {
                                        modelPerks.products[product._id].priceMod.first = priceMod;
                                    } else {
                                        modelPerks.products[product._id].priceMod.first += priceMod;
                                    }
                                    }else{
                                    if (!modelPerks.products.hasOwnProperty(product._id)) {
                                        modelPerks.products[product._id] = {priceMod: {first: 0, standard: priceMod }};
                                    } else if (!modelPerks.products[product._id].hasOwnProperty("priceMod")) {
                                        modelPerks.products[product._id].priceMod.standard = priceMod;
                                    } else {
                                        modelPerks.products[product._id].priceMod.standard += priceMod;
                                    }
                                }
                                
                            }
        
                        break;
                        case "disc-category":
                        //console.log('haleczko')
                            const productsInCategory = products.filter(product => {
                                return product.category === perk.target['disc-category'];
                            });
            
                            for (let i = 0; i < productsInCategory.length; i++) {
                                const product = productsInCategory[i];
                                const priceMod = (-1) * countValue( //to get disocunt
                                product.price,
                                perk.value, 
                                true
                                );
                                if(equippedItems[itemKey].itemModel.type === "scroll"){
                                if (!modelPerks.products.hasOwnProperty(product._id)) {
                                    modelPerks.products[product._id] = {priceMod: {first: priceMod, standard: 0 }};
                                } else if (!modelPerks.products[product._id].hasOwnProperty("priceMod")) {
                                    modelPerks.products[product._id].priceMod.first = priceMod;
                                } else {
                                    modelPerks.products[product._id].priceMod.first += priceMod;
                                }
                                }else{
                                if (!modelPerks.products.hasOwnProperty(product._id)) {
                                    modelPerks.products[product._id] = {priceMod: {first: 0, standard: priceMod }};
                                } else if (!modelPerks.products[product._id].hasOwnProperty("priceMod")) {
                                    modelPerks.products[product._id].priceMod.standard = priceMod;
                                } else {
                                    modelPerks.products[product._id].priceMod.standard += priceMod;
                                }
                                }
                            }
        
                            break;
                        default:
                            break;
                        }
                    }
                });
            }
            });
        
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                const experienceModFromAbsolute = countValue(product.price * 10, modelPerks.rawExperience.absolute, false);
                const experienceModFromPercent = countValue(product.price * 10, modelPerks.rawExperience.percent, false);
                const experienceMod = experienceModFromAbsolute + experienceModFromPercent;
                if (!modelPerks.products.hasOwnProperty(product._id)) {
                    modelPerks.products[product._id] = { experienceMod: experienceMod };
                } else if (!modelPerks.products[product._id].hasOwnProperty("experienceMod")) {
                    modelPerks.products[product._id]["experienceMod"] = experienceMod;
                } else {
                    modelPerks.products[product._id]["experienceMod"] += experienceMod;
                }
            }
                resolve(modelPerks);
        } catch (e) {
            reject(e);
        }
    }); 
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