const basicPath = '/images/icons/'
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
export const uiPaths = {...iconPaths}


export const appearancePaths = {
    male: '/images/appearance/male-body.png',
    female: '/images/appearance/female-body.png'
}