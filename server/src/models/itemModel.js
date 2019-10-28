import mongoose from "mongoose";
import validator from "validator";

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

  //Potrzeba więcej perków - zapytać Krystiana
});

export const ItemModel = new mongoose.model("itemModel", ItemModelSchema);
