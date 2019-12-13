import React from 'react'
import { compose } from "redux";
import { connect } from "react-redux";



const withMissionItemCommon = (WrappedComponent, mission) => {
    return class extends React.Component {

        render(){
            
            const isAppropriatePlayers = (minPlayers, maxPlayers) => {
                return (currentPlayersInParty >= minPlayers && currentPlayersInParty <= maxPlayers)
            } 


            const players = (minPlayers, maxPlayers) => {
                if(minPlayers === maxPlayers){
                    return minPlayers
                }else {
                    return `${minPlayers}-${maxPlayers}`
                }
            }

            const designateUserLevel = (points) => {
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


            const user = this.props.auth.profile
        
            
            const currentPlayersInParty = this.props.party.members.length + 1; //returned from backend (read from user profile -> user.party.members.length + 1 [1 for leader] EXPERIMENTAL)
            const leader = !this.props.party.leader._id  || (this.props.auth.uid === this.props.party.leader._id) //only leader can enter mission - from backend as above
            
            
            //one shot to events can be separated (rally, missions) on back/front
            
            //party.map -> sum = sum + user.strength -> totalStrength

            
            
            let totalStrength = user.attributes.strength + user.userPerks.attrStrength
            let totalDexterity = user.attributes.dexterity + user.userPerks.attrDexterity
            let totalMagic = user.attributes.magic + user.userPerks.attrMagic
            let totalEndurance = user.attributes.endurance + user.userPerks.attrEndurance
            let minUserLevelInParty = designateUserLevel(user.experience)

            
            let party = [this.props.party.leader, ...this.props.party.members].filter((member) =>{ //exclude 'user' and nulls
                return (member && member._id !== this.props.auth.uid)
            })

            console.log(party)

            party.forEach((member) => {
                totalStrength += member.attributes.strength + member.userPerks.attrStrength
                totalDexterity += member.attributes.dexterity + member.userPerks.attrDexterity
                totalMagic += member.attributes.magic + member.userPerks.attrMagic
                totalEndurance += member.attributes.endurance + member.userPerks.attrEndurance
                minUserLevelInParty = Math.min(designateUserLevel(member.experience), minUserLevelInParty)
            })

            //console.log(totalStrength, totalDexterity, totalMagic, totalEndurance, minUserLevelInParty)


            // const totalStrength = 4
            // const totalDexterity = 4
            // const totalMagic = 4
            // const totalEndurance = 4
            // const minUserLevelInParty = 2;

            const appropriatePlayers = isAppropriatePlayers(mission.minPlayers, mission.maxPlayers)
            const appropriateLevel = minUserLevelInParty >= mission.level;
            const appropriateStrength = totalStrength >= mission.strength
            const appropriateDexterity = totalDexterity >= mission.dexterity
            const appropriateMagic = totalMagic >= mission.magic
            const appropriateEndurance = totalEndurance >= mission.endurance
            const appropriateAttributes = appropriateStrength && appropriateDexterity && appropriateMagic && appropriateEndurance

            const isMissionActive = appropriatePlayers && appropriateLevel && appropriateAttributes

    
            return(
                <WrappedComponent
                    mission={mission}
                    playersLabel={players}
                    leader={leader}
                    totalStrength={totalStrength}
                    totalDexterity={totalDexterity}
                    totalMagic={totalMagic}
                    totalEndurance={totalEndurance}
                    appropriatePlayers={appropriatePlayers}
                    appropriateLevel={appropriateLevel}
                    appropriateStrength={appropriateStrength}
                    appropriateDexterity={appropriateDexterity}
                    appropriateMagic={appropriateMagic}
                    appropriateEndurance={appropriateEndurance}
                    isMissionActive={isMissionActive}
                    {...this.props}
                />   
            )
        }
    }
}

const mapStateToProps = state => {
    return {
      auth: state.auth,
      party: state.party,
    };
};
  
  
const composedWithMissionItemCommon = compose(
    connect(
        mapStateToProps
    ),
    withMissionItemCommon
);

export default composedWithMissionItemCommon;