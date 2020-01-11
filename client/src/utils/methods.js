export async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

export const designateUserLevel = (points) => {
  const a = 10;
  const b = 100;
  
  let previousThreshold = 0;
  for (let i=1; i<=100; i++) {
      const bottomThreshold = previousThreshold
      const topThreshold = previousThreshold + (a*(i**2) + b)

      if(points >= bottomThreshold && points < topThreshold){
          return i
      }
      previousThreshold = topThreshold;
  }
}


export const createAvatarPlaceholder = (name) => {

  if (!(/\s/.test(name))) {
      return name.charAt(0).toUpperCase()
  }
  
  const initials = name.split(" ").map(word => {
      return word.charAt(0)
  }).join('').toUpperCase()

  return initials.substring(0,2)
}