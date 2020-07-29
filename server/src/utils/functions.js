import sharp from "sharp";
import fs from "fs";
import mkdirp from "mkdirp"
import axios from 'axios'
import logger from '@logger'

//REF
export const initCleaning = async () => {
  try {
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

    logger.info('Initialization completed!')

  } catch (e) {
    console.log(e.message)
  }

}

// @TO-DO - Swap to "for of" in whole project...
export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}



export const designateExperienceMods = (baseExp, rawExpMods) => {
  let modExp = baseExp
  const absoluteMod = parseFloat(rawExpMods.absolute)
  const percentMod = parseFloat(rawExpMods.percent)

  if (absoluteMod > 0.0) {
    modExp += absoluteMod
  }

  if (percentMod > 0.0) {
    modExp += baseExp * (percentMod / 100.0)
  }

  return parseInt(modExp)
}

export const updateAmuletCounters = (amuletCounters, amulets) => {

  amulets.forEach((amulet) => {

    const index = amuletCounters.findIndex((item) => item.amulet.toString() === amulet.itemModel.toString())
    if (index > -1) {
      amuletCounters[index].counter += amulet.quantity
    } else {
      amuletCounters = [...amuletCounters, { counter: amulet.quantity, amulet: amulet.itemModel }]
    }
  })

  return amuletCounters
}


export const savePNGImage = async (
  imageFile,
  ownerId,
  uploadPath,
  previousFileName,
  date
) => {
  let imageName
  if (date) {
    imageName = ownerId + date + ".png"
  } else {
    imageName = ownerId + Date.now() + ".png";
  }
  await mkdirp(uploadPath);
  return new Promise((resolve, reject) => {
    sharp(imageFile)
      .resize({ width: 124 })
      .toFormat('png')
      .toFile(uploadPath + imageName)
      .then(function (newFileInfo) {
        if (previousFileName) {
          fs.unlink(uploadPath + previousFileName, async function (err) {
            if (err) { console.log(err) }
            //console.log("File deleted!");
            resolve(imageName);
          });
        } else {
          resolve(imageName);
        }
      })
      .catch(function (err) {
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
  if (date) {
    imageName = ownerId + date + ".svg"
  } else {
    imageName = ownerId + Date.now() + ".svg";
  }

  await mkdirp(uploadPath);

  return new Promise((resolve, reject) => {
    try {
      fs.writeFile(uploadPath + imageName, imageFile, (err) => {

        if (previousFileName) {
          fs.unlink(uploadPath + previousFileName, function (err) {
            if (err) { console.log(err) };
            //console.log("File deleted!");
            resolve(imageName);
          });
        } else {
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
  return new Promise((resolve, reject) => {
    fs.access(uploadPath + fileName, fs.F_OK, async err => {
      if (err) {
        //proceed with model functions (do not throw error)
        resolve(false);
      }
      //Remove file if found
      fs.unlink(uploadPath + fileName, async function (err) {
        if (err) throw err;
        //console.log("File deleted!");
        resolve(true);
      });
    });
  })

};


export const getEndpointError = (type, message, uid, status) => {
  const userString = uid ? `, ${uid}` : ''
  const e = new Error(message + userString)

  if (type) {
    e.type = type
  }

  if (status){
    e.status = status
  }

  return e
}
