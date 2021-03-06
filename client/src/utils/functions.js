import { levelingEquation } from "./constants";
import {categoryLabels, roomLabels} from './labels'

export async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

export const convertToStack = itemsToConvert => {
  let itemModels = [];
  itemsToConvert.forEach(itemToConvert => {
    //NOTE: filter returns new array - if for itemModels gets zero length, it is new name
    if (
      itemModels.filter(
        itemModel => itemModel.name === itemToConvert.itemModel.name
      ).length === 0
    ) {
      itemModels = [...itemModels, itemToConvert.itemModel];
    }
    //console.log(itemModels)
  });

  let itemObjects = [];
  itemModels.forEach(itemModel => {
    let instanceItemsIds = [];
    itemsToConvert.forEach(itemToConvert => {
      if (itemModel.name === itemToConvert.itemModel.name) {
        instanceItemsIds = [...instanceItemsIds, itemToConvert._id];
      }
    });
    const itemObject = {
      itemModel: itemModel,
      instancesIds: instanceItemsIds
    };
    itemObjects = [...itemObjects, itemObject];
  });
  return itemObjects;
};

export const getUserLevel = (points, getRelatives) => {
  const a = levelingEquation.a;
  const b = levelingEquation.b;
  const pow = levelingEquation.pow;

  let previousThreshold = 0;
  for (let i = 1; i <= 1000; i++) {
    const bottomThreshold = previousThreshold;
    const topThreshold = previousThreshold + (a * i ** pow + b);

    if (points >= bottomThreshold && points < topThreshold) {
      if(getRelatives){
        return {level: i, relativeExp: points - bottomThreshold, relativeThreshold: topThreshold - bottomThreshold}
      }
      return i;
    }
    previousThreshold = topThreshold;
  }

  return 1000
}

export const bagArrayToCategories = (bag) => {
  const categorisedBag = {}
  bag.forEach(item => {
      if(categorisedBag.hasOwnProperty(item.itemModel.type)){
          categorisedBag[item.itemModel.type].push(item) 
      }else{
          categorisedBag[item.itemModel.type] = [item]
      }
  });
  return categorisedBag
  
}


export const getValue = (perkType, value) => {
  if(perkType.includes('attr')){
    if(!value.includes('+') && !value.includes('-')){
      return `+${value}`
    }
  }else if(perkType.includes('disc')){
    if(!value.includes('%')){
      return value + " zł"
    }
  }else if(perkType.includes('experience')){
    let modValue = value
    if(!value.includes('+') && !value.includes('-')){
      modValue = `+${value}`
    }
    if(!value.includes('%')){
      modValue += " PD"
    }
    return modValue
  }

  return value
}


export const getTarget = (perkType, target) => {
  const targetPerks = ['disc-product', 'disc-category', 'disc-rent']

  if(targetPerks.includes(perkType)){
    switch(perkType) {
      case 'disc-product':
        return target['disc-product'] && target['disc-product'].name
      case 'disc-category':
        return categoryLabels[target['disc-category']]
      case 'disc-rent':
        return roomLabels[target['disc-rent']]
      default:   
        break
    }
  }
  return null
}