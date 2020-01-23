import mongoose from "mongoose";
import { User } from "../models/user";
import { Product } from "../models/product";
import moment from "moment";
import sharp from "sharp";
import fs from "fs";
import mkdirp from "mkdirp"
import { levelingEquation } from "./definitions";
import { Party } from "../models/party";
import { MissionInstance } from "../models/missionInstance";
import axios from 'axios'

export const initCleaning = async () => {
  try{
    //await Party.deleteMany() //drop() did not work on 'model' / remove() depracated
    //await MissionInstance.deleteMany()
    console.log('Initialization completed!')
    
  }catch(e){
    console.log(e.message)
  }
  
}

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const updatePerks = (user, forcing, forcingWithoutParty) => {
  //'forcing' - update without checking perksUpdatedAt

  return new Promise(async (resolve, reject) => {
    try {
      if (forcing || isNeedToPerksUpdate(user)) {
        user.userPerks = await designateUserPerks(user);
        user.perksUpdatedAt = moment().toISOString(); //always in utc
        await user.save();
      }

      if (user.party) {
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
              throw Error(`Member (${memberId} does not exist!`);
            }

            if (
              (forcing && !forcingWithoutParty) ||
              isNeedToPerksUpdate(member)
            ) {
              member.userPerks = await designateUserPerks(member);
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
};

//OK
export const designateUserPerks = async user => {
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
          console.log(
            "Local hours:",
            startTimeLocale.hour(),
            endTimeLocale.hour()
          );

          let startTime = moment.utc(startTimeLocale);
          let endTime = moment.utc(endTimeLocale);
          console.log("UTC hours:", startTime.hour(), endTime.hour());
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

      const countValue = (source, perkValue, isCurrency) => {
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
                    return product._id.toString() === perk.target['disc-product'];
                  });

                  if (product) {
                    const priceMod = countValue(
                      product.price,
                      perk.value,
                      true
                    );
                    if (!modelPerks.products.hasOwnProperty(product._id)) {
                      modelPerks.products[product._id] = { priceMod: priceMod };
                    } else if (!modelPerks.products[product._id].hasOwnProperty("priceMod")) {
                      modelPerks.products[product._id]["priceMod"] = priceMod;
                    } else {
                      modelPerks.products[product._id]["priceMod"] += priceMod;
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
                    const priceMod = countValue(
                      product.price,
                      perk.value,
                      true
                    );
                    if (!modelPerks.products.hasOwnProperty(product._id)) {
                      modelPerks.products[product._id] = { priceMod: priceMod };
                    } else if (!modelPerks.products[product._id].hasOwnProperty("priceMod")) {
                      modelPerks.products[product._id]["priceMod"] = priceMod;
                    } else {
                      modelPerks.products[product._id]["priceMod"] += priceMod;
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
        const experienceModFromAbsolute = countValue(
          product.price * 10,
          modelPerks.rawExperience.absolute,
          false
        );
        const experienceModFromPercent = countValue(
          product.price * 10,
          modelPerks.rawExperience.percent,
          false
        );
        const experienceMod =
          experienceModFromAbsolute + experienceModFromPercent;
        if (!modelPerks.products.hasOwnProperty(product._id)) {
          modelPerks.products[product._id] = { experienceMod: experienceMod };
        } else if (!modelPerks.products[product._id].hasOwnProperty("experienceMod")) {
          modelPerks.products[product._id]["experienceMod"] = experienceMod;
        } else {
          modelPerks.products[product._id]["experienceMod"] += experienceMod;
        }
      }

      //console.log(modelPerks)

      resolve(modelPerks);
    } catch (e) {
      reject(e);
    }
  });
};

//OK
export const isNeedToPerksUpdate = user => {
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

export const designateNewLevels = (baseExp, newExp) => {
  const levelsData = designateUserLevel(baseExp, newExp)
  return levelsData.newLevel - levelsData.oldLevel
}

export const designateExperienceMods = (baseExp, rawExpMods) => {
  let modExp = baseExp
  const absoluteMod = parseFloat(rawExpMods.absolute)
  const percentMod = parseFloat(rawExpMods.percent)
  
  if(absoluteMod > 0.0){
      modExp += absoluteMod
  }

  if(percentMod > 0.0){
      modExp += baseExp * (percentMod/ 100.0)
  }
  
  return parseInt(modExp)
}

export const updateAmuletCounters = (amuletCounters, amulets) => {

  amulets.forEach( (amulet) => {

    const index = amuletCounters.findIndex((item) => item.amulet.toString() === amulet.itemModel.toString())
    if(index > -1){
        amuletCounters[index].counter += amulet.quantity
    }else{
        amuletCounters = [...amuletCounters, {counter: amulet.quantity, amulet: amulet.itemModel}] 
    }
  })

  return amuletCounters
}

export const userStandardPopulate = async user => {
  await user
    .populate({
      path: "bag",
      populate: { path: "itemModel", select: '_id description imgSrc name perks type', populate: { path: "perks.target.disc-product", select: '_id name' } }
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
  return user; //CONSIDER: return user.bag -> props: const user declaration
};

export const designateUserLevel = (points, addPoints) => {
  const a = levelingEquation.a;
  const b = levelingEquation.b;
  const pow = levelingEquation.pow;

  let previousThreshold = 0;
  let oldLevel;
  for (let i = 1; i <= 1000; i++) {
    const bottomThreshold = previousThreshold;
    const topThreshold = previousThreshold + (a * i ** pow + b);

    if (points >= bottomThreshold && points < topThreshold) {
      if(!addPoints){
        return i
      }
      oldLevel = i
    }

    if(addPoints && points + addPoints >= bottomThreshold && points + addPoints < topThreshold){
      return {oldLevel, newLevel: i}
    }
    previousThreshold = topThreshold;
  }

  return 1000
};

export const validateInMissionInstanceStatus = (userId, newStatus, secondNewStatus) => {
  return new Promise(async (resolve, reject) => {
    const missionInstance = await MissionInstance.findOne({
      party: { $elemMatch: { profile: userId } }
    });

    if (missionInstance) {
      const index = missionInstance.party.findIndex(
        user => user.profile.toString() === userId
      );

      if (index > -1) {
        if (missionInstance.party[index].inMission !== newStatus) {
          missionInstance.party[index].inMission = newStatus;
          if(secondNewStatus){
            missionInstance.party[index].readyStatus = secondNewStatus
          }
          await missionInstance.save();
          return resolve(true);
        }
      }
    }
    resolve(false);
  });
};

export const validateInShopPartyStatus = (userId, newStatus) => {
  return new Promise(async (resolve, reject) => {
    const party = await Party.findOne({ leader: userId }); //only if leader going to be disconnected

    if (party && party.inShop !== newStatus) {
      party.inShop = newStatus;
      await party.save();
      return resolve(true);
    }
    resolve(false);
  });
};

export const saveImage = async (
  imageFile,
  ownerId,
  uploadPath,
  previousFileName,
  date
) => {
  let imageName
  if(date){
    imageName = ownerId + date + ".png"
  }else{
    imageName = ownerId + Date.now() + ".png";
  }
  await mkdirp(uploadPath);
  return new Promise ((resolve, reject) => {
    sharp(imageFile)
      .resize({ width: 124 })
      .toFormat('png')
      .toFile(uploadPath + imageName)
      .then(function(newFileInfo) {
        if (previousFileName) {
          fs.unlink(uploadPath + previousFileName, async function(err) {
            if (err) {console.log(err)}
            console.log("File deleted!");
            resolve(imageName);
          });
        }else{
            resolve(imageName);
        }
      })
      .catch(function(err) {
        console.log(err);
        reject("Błąd podczas wczytywania obrazu");
      });
  }) 
};

export const saveAppearanceImage = async (
  imageFile,
  ownerId,
  uploadPath,
  previousFileName,
  date
) => {



  let imageName
  if(date){
    imageName = ownerId + date + ".svg"
  }else{
    imageName = ownerId + Date.now() + ".svg";
  }

  await mkdirp(uploadPath);
  
  return new Promise ((resolve, reject) => {
    try {
      fs.writeFile(uploadPath+imageName, imageFile, (err)=>{

        if (previousFileName) {
          fs.unlink(uploadPath + previousFileName, function(err) {
            if (err) {console.log(err)};
            console.log("File deleted!");
            resolve(imageName);
          });
        }else{
            resolve(imageName);
        }
      })
    } catch (error) {
      console.log(err);
        throw new Error("Błąd podczas wczytywania obrazu");
    }
  }) 
};



export const removeImage = (uploadPath, fileName) => {
    //Check if file exists
  return new Promise ((resolve, reject) => {
    fs.access(uploadPath + fileName, fs.F_OK, async err => {
        if (err) {
          //proceed with model functions (do not throw error)
          resolve(false);
        }
        //Remove file if found
        fs.unlink(uploadPath + fileName, async function(err) {
          if (err) throw err;
          console.log("File deleted!");
          resolve(true);
      });
    });
  }) 
 
};

export const verifyCaptcha = (url) => {
  return new Promise (async (resolve, reject) => {
    try{
      const res = await axios.post(url)
      console.log(res.data)
      if(!res.data.success){
        return reject()
      }
      resolve()
    }catch(e){
      reject(e)
    }
    
  })
}
