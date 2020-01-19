import { levelingEquation } from "./definitions";

export async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

export const designateUserLevel = (points, getRelatives) => {
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



export const createAvatarPlaceholder = (name) => {

  if (!name || !name.length) return ''

  
  if (!(/\s/.test(name))) {
      return name.charAt(0).toUpperCase()
  }
  
  const initials = name.split(" ").map(word => {
      return word.charAt(0)
  }).join('').toUpperCase()

  return initials.substring(0,2)
}