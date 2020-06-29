import React from "react";
import styled from 'styled-components'
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PlayerShopButton from "./PlayerShopButton";
import { palette } from "../../utils/constants";

const Container = styled(Paper)`
  width: 95%;
  padding: 1rem;
  margin: 1rem auto;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.54);
  border: 1px solid ${palette.background.grey};
`


const PlayerShopButtons = ({ users, activeUser, handleChipClick }) => {
  return (
    <Container square >
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
