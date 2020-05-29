import React from "react";
import styled from 'styled-components'

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";

import StatsListItem from "./StatsListItem";
import AvatarWithPlaceholder from 'components/AvatarWithPlaceholder'

import { palette } from "utils/definitions"



const Background = styled.div`
    background-color: ${props => props.color};
    color: white;
`


const StatsDialog = props => {

    return (
        <Dialog style={{ margin: '-24px' }} fullWidth open={props.open} onClose={props.handleClose}>
            <DialogContent style={{ padding: '0' }}>
                <Background color={palette.primary.main}>
                    <Grid
                        container
                        direction='column'
                        justify='center'
                        align='center'
                        style={{ padding: '2rem 0 2rem 0' }}
                    >
                        <Grid item>
                            <AvatarWithPlaceholder
                                avatar={props.profile.avatar}
                                width="100px"
                                height="100px"
                                placeholder={{
                                    text: props.profile.name,
                                    fontSize: '3.7rem'
                                }}
                            />
                        </Grid>
                        <Grid item style={{ padding: '1rem 0 0 0' }}>
                            <Typography variant="h4">
                                {props.profile.name}
                            </Typography>
                        </Grid>
                    </Grid>
                </Background>
            </DialogContent>
            <DialogContent style={{ padding: '0' }}>
                <List style={{ padding: '0', maxHeight: '172px' }} align="flex-start">
                    <StatsListItem
                        text="Ukończone rajdy"
                        counter={props.profile.statistics.rallyCounter}
                    />
                    <StatsListItem
                        text="Ukończone misje"
                        counter={props.profile.statistics.missionCounter}
                    />
                    {props.profile.statistics.amuletCounters.map((amuletCounter, index) => {
                        return (
                            <StatsListItem
                                key={amuletCounter._id}
                                text="Wydane"
                                image={amuletCounter.amulet.imgSrc}
                                counter={amuletCounter.counter}
                            />
                        )
                    })}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Zamknij
            </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StatsDialog;