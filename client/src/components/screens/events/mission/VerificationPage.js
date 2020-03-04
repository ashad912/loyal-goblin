import React from "react";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import AwardListItem from '../AwardListItem'
import { Redirect} from 'react-router-dom'
import styled from 'styled-components'

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
    flex-grow: 12;
    padding: 2rem 1rem;
    border: 1px solid #eeeeee;
`

const VerificationPage = props => {

  const [backToMainScreen, setBackToMainScreen] = React.useState(false)
  
  let missionAwards = []
  Object.keys(props.missionAwards).forEach((category)=> {
    if(category === 'any' || category === props.userClass){
      missionAwards = [...missionAwards, ...props.missionAwards[category]]
    }
  })

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
    await props.authCheck()
    setBackToMainScreen(true)
  }
  
  
  return (
    <React.Fragment>
      {backToMainScreen && (
        <Redirect to={{
            pathname: '/',                               
      }} />)}

      <AwardsContainer maxWidth="xs">
        <StyledPaper square>
          <div id="up">
            <Typography variant="h5" style={{marginBottom: '1rem'}}>Misja ukończona!</Typography>

            {props.missionExperience > 0 &&
              <React.Fragment>
                <Typography style={{marginBottom: '0.5rem'}}>Zdobyte doświadczenie:</Typography>
                <Typography variant='h6' style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>+{designateExperienceMods(props.userPerks.rawExperience, props.missionExperience)} PD</Typography>
              </React.Fragment>  
            }
          </div>
          {missionAwards.length > 0 &&
            <React.Fragment>
              <Typography style={{marginBottom: '0.5rem'}}>Zdobyte przedmioty:</Typography>
              <List component="nav" style={{ width: "100%", maxHeight: `calc(100vh - 446px)`, overflowY: 'scroll', marginBottom: '1rem' }}>
                {missionAwards.map(award => {
                  return (
                    <AwardListItem key={award.itemModel._id} item={award} />
                  );
                })}
              </List>
            </React.Fragment>
          }
          
          <Button 
            id="down"
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
    </React.Fragment>
  );
};

export default VerificationPage;
