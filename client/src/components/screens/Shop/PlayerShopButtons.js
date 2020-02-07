import React from "react";
import styled from 'styled-components'
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PlayerShopButton from "./PlayerShopButton";

const Container = styled(Paper)`
width: 95%;
padding: 0.5rem;
margin: 0.5rem auto;
box-sizing: border-box;
`


const PlayerShopButtons = ({ users, activeUser, handleChipClick }) => {
  return (
    <Container >
      <Grid container spacing={0}>
        {users.map(user => {
          return (
            <Grid key={user._id} item xs>
              <PlayerShopButton
                id={user._id}
                avatar={user.avatar}
                name={user.name}
                active={user._id === activeUser ? 1:0}
                handleClick={handleChipClick}
              />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default PlayerShopButtons;
