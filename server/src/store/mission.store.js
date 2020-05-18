const instanceValidTimeInMins = "30"
const timeUnit = "m"
const timeIntUnit = timeUnit === "m" ? 60 : 1

const missionListProjection = {
    '_id': 1,
    'title': 1,
    'description': 1,
    'imgSrc': 1,
    'minPlayers': 1,
    'maxPlayers': 1,
    'level': 1,
    'strength': 1,
    'dexterity': 1,
    'magic': 1,
    'endurance': 1,
    'unique': 1,
    'amulets': 1,
    'awardsAreSecret': 1,
    'awards': {
        $cond: {
            if: {
                '$eq': ['$awardsAreSecret', true]
            },
            then: {     
                "any": [],
                "warrior": [],
                "rogue": [],
                "mage": [],
                "cleric": [],
            },
            else: '$awards'
        }
    },
}

const uploadPath = "../static/images/missions/"

export default {
    instanceValidTimeInMins,
    timeUnit,
    timeIntUnit,
    missionListProjection,
    uploadPath

}