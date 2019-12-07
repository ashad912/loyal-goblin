const createAvatarPlaceholder = (name) => {

    if (!(/\s/.test(name))) {
        return name.charAt(0).toUpperCase()
    }
    
    const initials = name.split(" ").map(word => {
        return word.charAt(0)
    }).join('').toUpperCase()

    return initials
}

export default createAvatarPlaceholder