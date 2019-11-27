import mongoose from "mongoose";
import { asyncForEach } from '../utils/methods'
import validator from "validator";
import { Mission } from "./mission";
import { Rally } from '../models/rally';
import { User } from '../models/user';
import { Item } from '../models/item'

export const itemModelTypes = [
  "amulet",
  "weapon",
  "chest",
  "legs",
  "hands",
  "feet",
  "head",
  "ring",
  "scroll",
  "mixture",
  "torpedo"
];

export const perkTypes = [
  "attr-strength",
  "attr-dexterity",
  "attr-magic",
  "attr-endurance",
  "experience",
  "disc-product",
  "disc-category",
  "disc-rent",
  "custom"
];

const ItemModelSchema = new mongoose.Schema({
  //class of Item

  type: {
    type: String,
    required: true
  }, //CONSIDER: type as ItemType with separate schema and model
  name: {
    type: String,
    required: true
  },
  requiredLevel: {
    type: Number
  },
  description: {
    type: String,
    required: true
  },
  imgSrc: {
    type: String,
    required: true
  },
  class: { type: String, required: true },
  twoHanded: {type: Boolean},

  perks: [
    {
      perkType: String, //perkTypes - easier to search -> u know key words -> perks.map(perk => if(perk.perkType = 'disc-product' && perk.name === product.name) -> give discount
      value: String, //value  '100' or '15%' - interpreted by discountCounting method (finding percent sign -> converting)
      target: String, // field necessary for disc-product/disc-category/disc-rent
      time: [
        {
          //u can specify many time periods for perk - ex: day: 5, startHour: 16, lengthInHours: 11 -> Friday, 16:00 - 03:00 [03:00 is at Saturday]
          //NO NEED TO CARE ABOUT DAY CHANGE (midnight)
          startDay: {
            type: Number,
            min: 1,
            max: 7,
            validate(value) {
              if (!validator.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`);
              }
            }
          }, //possible values 1-7
          startHour: {
            type: Number,
            min: 0,
            max: 23,
            validate(value) {
              if (!validator.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`);
              }
            }
          },
          lengthInHours: {
            type: Number,
            min: 1,
            max: 24,
            validate(value) {
              if (!validator.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`);
              }
            }
          }
        }
      ]
    }
  ]
});

//OK
ItemModelSchema.pre('remove', async function (next){
  const itemModel = this

  

  // //mission - amultes, awards; 
  let missions = await Mission.find(
    {$or: [
        {'amulets': {$elemMatch: {'itemModel': itemModel._id}}},
        {'awards.any': {$elemMatch: {'itemModel': itemModel._id}}},
        {'awards.warrior': {$elemMatch: {'itemModel': itemModel._id}}},
        {'awards.rogue': {$elemMatch: {'itemModel': itemModel._id}}},
        {'awards.mage': {$elemMatch: {'itemModel': itemModel._id}}},
        {'awards.cleric': {$elemMatch: {'itemModel': itemModel._id}}},
    ] })


  //OK!
  await asyncForEach((missions), async mission => {
      mission.amulets = mission.amulets.filter((mission, index)=> {
          return mission.itemModel.toString() !== itemModel._id.toString()
      })
      await asyncForEach(Object.keys(mission.awards.toJSON()), async (className) => { //need toJSON to remove 'mongo keys'
          
          
          mission.awards[className] = mission.awards[className].filter((classAward) => {
              // /console.log('eq', classAward.itemModel, itemModel._id)
              return classAward.itemModel.toString() !== itemModel._id.toString()
          })
          
      })
      //console.log(mission._id)
      //console.log(mission.amulets)
      //console.log(mission.awards)
      await mission.save()
  })

  //OK!


  //rally - awardsLevels -> awards
  let rallies = await Rally.find(
      
      {'awardsLevels': {$elemMatch:
          {$or: [
              {'awards.any': {$elemMatch: {'itemModel': itemModel._id}}},
              {'awards.warrior': {$elemMatch: {'itemModel': itemModel._id}}},
              {'awards.rogue': {$elemMatch: {'itemModel': itemModel._id}}},
              {'awards.mage': {$elemMatch: {'itemModel': itemModel._id}}},
              {'awards.cleric': {$elemMatch: {'itemModel': itemModel._id}}},
          ]}
      }})

  //OK

  await asyncForEach(rallies, async rally => {
      await asyncForEach(rally.awardsLevels, async (awardsLevel, index) => {
          await asyncForEach(Object.keys(awardsLevel.awards.toJSON()), async (className) => {
              rally.awardsLevels[index].awards[className] = rally.awardsLevels[index].awards[className].filter((classAward) => {
                  return classAward.itemModel.toString() !== itemModel._id.toString()
              })
          })
      })
      //console.log(rally._id)
      //console.log(rally.awardsLevels)
      await rally.save()
  })

  //OK

  
  const itemInstances = await Item.find({itemModel: itemModel._id}) //if deleteMany runs remove middleware? -> NO

  await asyncForEach((itemInstances), async itemInstance => {
      //console.log(itemInstance._id)
      await itemInstance.remove() //running 'pre remove' item middleware
  })
  next()
})

export const ItemModel = new mongoose.model("itemModel", ItemModelSchema);
