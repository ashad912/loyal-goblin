import React from "react";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import AwardListItem from '../AwardListItem'
import styled from 'styled-components'

const AwardsContainer = styled(Container)`
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 6rem 0 6rem 0;
`

const StyledPaper = styled(Paper)`
    padding: 1rem;
    border: 1px solid #eeeeee;
`

const VerificationPage = props => {
  
  let missionAwards = []
  Object.keys(props.missionAwards).forEach((category)=> {
    if(category === 'any' || category === props.userClass){
      missionAwards = [...missionAwards, ...props.missionAwards[category]]
    }
  })
 
  return (
    <AwardsContainer maxWidth="xs">
      <StyledPaper>
        <Typography variant="h5" style={{marginBottom: '1rem'}}>Misja ukończona!</Typography>
        <Typography>Zdobyte przedmioty:</Typography>
        <List component="nav" style={{ width: "100%" }}>
          {missionAwards.map(award => {
            return (
              <AwardListItem key={award.itemModel._id} item={award} />
            );
          })}
        </List>
      </StyledPaper>
    </AwardsContainer>
  );
};

export default VerificationPage;
