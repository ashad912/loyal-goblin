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

//REF
export const initCleaning = async () => {
  try{
    // const parties = await Party.find({})
    // await asyncForEach((parties), party => {
    //   await party.remove() //to start pre remove middleware
    // })
    //await Party.clear()
    //await MissionInstance.clear()
    // const missionInstances = await MissionInstance.find({})
    // await asyncForEach(missionInstances, (missionInstance) => {
    //   await missionInstance.remove()
    // })
    
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



//REF
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

//REF
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
//REF
export const removeMissionInstanceIfExits = (id) => {
  return new Promise (async (resolve, reject)=> {
    try{
      const missionInstance = await MissionInstance.findOne(
        {party: {$elemMatch: {profile: id}}}    
      )
      
      if(missionInstance){
        await missionInstance.remove()
        return resolve(true)
      }
      
      //update missions -> function for getMissionList
      resolve(false)
    }catch(e){
      reject(e)
    }
  })
}
//REF
export const validatePartyAndLeader = (user, inShop) => {
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

export const savePNGImage = async (
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
            //console.log("File deleted!");
            resolve(imageName);
          });
        }else{
            resolve(imageName);
        }
      })
      .catch(function(err) {
        console.log(err);
        reject("Image loading error");
      });
  }) 
};

export const saveSVGImage = async (
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
            //console.log("File deleted!");
            resolve(imageName);
          });
        }else{
            resolve(imageName);
        }
      })
    } catch (error) {
      console.log(err);
        throw new Error("Image loading error");
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
          //console.log("File deleted!");
          resolve(true);
      });
    });
  }) 
 
};

export const verifyCaptcha = (url) => {
  return new Promise (async (resolve, reject) => {
    try{
      const res = await axios.post(url)
      //console.log(res.data)
      if(!res.data.success){
        return reject()
      }
      resolve()
    }catch(e){
      reject(e)
    }
    
  })
}
