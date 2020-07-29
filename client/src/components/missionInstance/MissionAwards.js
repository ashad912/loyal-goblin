import React from "react";
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'

import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import AwardsHeader from "../tabs/AwardsHeader";
import AwardsList from "../tabs/AwardsList";




const AwardsContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    flex-grow: 12;
    justify-content: center;
    margin: 1rem 0 1rem 0;
    padding: 0;
`

const StyledPaper = styled(Paper)`
    display: flex;
    flex-direction: column;
    padding: 2rem 1rem;
    border: 1px solid #eeeeee;
`

const MissionAwards = props => {

  const history = useHistory()
  
  const designateExperienceMods = (rawExpMods, baseExp) => {
    let modExp = baseExp
    const absoluteMod = parseFloat(rawExpMods.absolute)
    const percentMod = parseFloat(rawExpMods.percent)
    
    if(absoluteMod > 0.0){
        modExp += absoluteMod
    }
  
    if(percentMod > 0.0){
        modExp += baseExp * (percentMod/ 100.0)
    }
    
    return parseInt(modExp)
  }

  const handleBackToMainScreen = async () => {
    history.push({
      pathname: '/',
      state: {indexRedirect: 0, authCheck: true}
    }) 
  }

  let missionAwards = []
  Object.keys(props.missionAwards).forEach((category)=> {
    if(category === 'any' || category === props.userClass){
      missionAwards = [...missionAwards, ...props.missionAwards[category]]
    }
  })
  
  const experience = designateExperienceMods(props.userPerks.rawExperience, props.missionExperience)

  return (
      <AwardsContainer maxWidth="xs" style={{padding: '0.5rem 0rem'}}>
        <StyledPaper square>
          <div>
            <Typography variant="h5" style={{marginBottom: '1rem'}}>Misja ukończona!</Typography>
            <AwardsHeader 
              experience={experience}
              awards={missionAwards}
              expTitle='Zdobyte doświadczenie:'
              awardsTitle='Zdobyte przedmioty:'
            />
          </div>
          <AwardsList 
            awards={missionAwards}
            style={{
              width: "100%", 
              maxHeight: `calc(100vh - 469px)`, 
              overflowY: 'scroll', 
              marginBottom: '1rem' 
            }}
          />          
          <Button 
            style={{ justifyContent: 'center', marginTop: '1rem'}}
            variant="contained"
            fullWidth
            onClick={handleBackToMainScreen} 
            color="primary" 
          >
            Wróć do ekranu głównego
          </Button>
        </StyledPaper>
      </AwardsContainer>
  );
};

export default MissionAwards;
