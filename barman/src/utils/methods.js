export async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
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