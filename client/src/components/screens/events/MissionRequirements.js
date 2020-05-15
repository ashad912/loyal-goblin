import React from 'react'
import PropTypes from 'prop-types'
import { uiPaths } from "../../../utils/definitions";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import MissionAttribute from './MissionAttribute'
import MissionAmulets from "./MissionAmulets";

const MissionRequirements = ({props, mission, titleMargin, dataMargin, headerVariant, bodyVariant}) => {
    return(

        <Grid
            container
            direction="column"
        >
            <Grid
                container
                direction="row"
                style={{margin: titleMargin}}
            >
                
                <Grid item>
                    <Typography
                        component="span"
                        variant={headerVariant}
                        color="textPrimary"
                        style={{fontWeight: 'bold'}}
                    >
                        Wymagania
                    </Typography>
                </Grid> 
            </Grid>
            <Grid
                container
                direction="row"
                style={{margin: dataMargin}}
            >
                
                <Grid item xs={3}>
                
                    <Typography
                        component="span"
                        style={{display: 'inline-flex'}}
                        variant={bodyVariant}
                        color={props.appropriateLevel ? 'textPrimary' : 'error'}
                    >
                        {`POZ: ${mission.level}`}
                    </Typography>
                </Grid>
                <Grid item xs={3} style={{display: 'inline-flex', alignItems: 'center'}}>
                    <img style= {{height: '1.2rem', width: '1.2rem', marginRight: '0.5rem'}} src={uiPaths.players}/>
                    <Typography
                        component="span"
                        variant={bodyVariant}
                        color={props.appropriatePlayers ? 'textPrimary' : 'error'}
                    >
                        {props.playersLabel(mission.minPlayers, mission.maxPlayers)}
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                style={{marginBottom: '0.5rem'}}
            >
                <MissionAttribute 
                    attribute='strength'
                    appropriate={props.appropriateStrength}
                    total={props.totalStrength}
                    required={mission.strength}
                    variant={bodyVariant}
                />
                <MissionAttribute 
                    attribute='dexterity'
                    appropriate={props.appropriateDexterity}
                    total={props.totalDexterity}
                    required={mission.dexterity}
                    variant={bodyVariant}
                />
                <MissionAttribute 
                    attribute='magic'
                    appropriate={props.appropriateMagic}
                    total={props.totalMagic}
                    required={mission.magic}
                    variant={bodyVariant}
                />
                <MissionAttribute 
                    attribute='endurance'
                    appropriate={props.appropriateEndurance}
                    total={props.totalEndurance}
                    required={mission.endurance}
                    variant={bodyVariant}
                />
                
            </Grid>
            
            <MissionAmulets 
                mission={mission}
                variant={bodyVariant}
            />  
        </Grid>
       
    )
}

MissionRequirements.propTypes = {
    props: PropTypes.object.isRequired,
    mission: PropTypes.shape({
        level: PropTypes.number,
        minPlayers: PropTypes.number,
        maxPlayers: PropTypes.number,
    }).isRequired,
    titleMargin: PropTypes.string.isRequired,
    dataMargin: PropTypes.string.isRequired,
    headerVariant:PropTypes.string.isRequired,
    bodyVariant: PropTypes.string.isRequired
}

export default MissionRequirements
