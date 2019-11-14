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



        
            const userLevel = 2;
            const currentPlayersInParty = 4; //returned from backend (read from user profile -> user.party.members.length + 1 [1 for leader] EXPERIMENTAL)
            const leader = true //only leader can enter mission - from backend as above
            

            //one shot to events can be separated (rally, missions) on back/front
            
            //party.map -> sum = sum + user.strength -> totalStrength
            
            const totalStrength = 4
            const totalDexterity = 4
            const totalMagic = 4
            const totalEndurance = 4

            const appropriatePlayers = isAppropriatePlayers(mission.minPlayers, mission.maxPlayers)
            const appropriateLevel = userLevel >= mission.level;
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
    };
};
  
  
const composedWithMissionItemCommon = compose(
    connect(
        mapStateToProps
    ),
    withMissionItemCommon
);

export default composedWithMissionItemCommon;