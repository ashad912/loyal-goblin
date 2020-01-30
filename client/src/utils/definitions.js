export const itemsPath = '/images/items/'
export const appearancePath = '/images/appearance/'
export const usersPath = '/images/avatars/'
export const missionsPath = '/images/missions/'
export const ralliesPath = '/images/rallies/'
export const productsPath = '/images/products/'

const basicPath = '/images/icons/'

export const uiPaths = {
    male: basicPath+'male.svg',
    female: basicPath+'female.svg',
    warrior: basicPath+'warrior.svg',
    rogue: basicPath+'rogue.svg',
    mage: basicPath+'mage.svg',
    cleric: basicPath+'cleric.svg',
}



const iconPaths = {
    male: 'male.svg',
    female: 'female.svg',
    warrior: 'warrior.svg',
    rogue: 'rogue.svg',
    mage: 'mage.svg',
    cleric: 'cleric.svg',
    strength: 'strength.svg',
    dexterity: 'dexterity.svg',
    magic: 'magic.svg',
    endurance: 'endurance.svg',
    lookForGroup: 'look-for-group.svg',
    addMember: 'add-member.svg',
    statistics: 'statistics.svg',
    ranking: 'ranking.svg'
}

Object.keys(iconPaths).forEach(path => {
    iconPaths[path] = basicPath + iconPaths[path]
})



export const uiAppearancePaths = {
    male: '/images/appearance/male-body.png',
    female: '/images/appearance/female-body.png'
}



export const levelingEquation = { //y = a*(x*pow) + b
    a: 10,
    b: 100,
    pow: 2,
}


export const palette = {
    primary: {
        light: "#66bb6a",
        main: "#388e3c",
        mainTransparent: "#388e3ccf",
        dark: "#1b5e20",
        contrastText: "#fff"
    },
    secondary: {
        light: "#f44336",
        main: "#e53935",
        dark: "#b71c1c",
        contrastText: "#fff"
    },
    background: {
        equipped: '#e6dc8d',
        standard: '#eeeeee'
    },
    border: "1px solid rgb(192, 192, 192)"
}

export const classThemes = {
    warrior: '#dc6060',
    mage: '#7ec1f1',
    rogue: '#c4c4c4',
    cleric: '#c8a612'
}