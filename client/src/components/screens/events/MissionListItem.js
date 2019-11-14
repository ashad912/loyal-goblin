import React from 'react'
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components'

import { classLabelsAny } from '../../../utils/labels';

const ShortDescription = styled(Typography)`
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    height: 60;
    overflow: hidden;
    whiteSpace: hidden;
    textOverflow: ellipsis;
`

const RequiredAttribute = styled(Typography)`
    margin: 0 0.5rem 0 0
    color: ${props => props.attr ? 'green' : 'red' } 
`

const StyledList = styled(List)`
    width: 100%;
    margin: 0 0 1rem 0;
`
const StyledBox = styled(Box)`
    margin: 0.5rem 0;

`



const MissionListItem = (props) => {

    const mission = props.mission
    return(
        <StyledBox border={1} borderColor="primary.main">

            <Grid
                container
                direction="column"
                style={{padding: '1rem', textAlign: 'left'}}
            >
                <Grid
                    container
                    direction="row"
                >
                    
                    <Grid item xs={9}>
                        <Grid
                            container
                            direction="column"
                            
                        >
                            <Grid item style={{marginBottom: '0.5rem'}}>
                                <Typography
                                    component="span"
                                    variant="h6"
                                    color="textPrimary"
                                >
                                    {mission.title}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <ShortDescription
                                    component="span"
                                    variant="body2"
                                    color="textPrimary"
                                >
                                    {mission.description}
                                </ShortDescription>
                            </Grid>
                        </Grid>   
                    </Grid> 
                    <Grid item xs={3} >
                        <Grid
                            container
                            direction="column"
                        >
                            <Grid item style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Avatar alt="avatar" style={{width: '3.5rem', height: '4rem'}} src={mission.avatarSrc.avatarTemp} />
                            </Grid>
                        </Grid>
                    </Grid> 
                </Grid>
                <Grid
                    container
                    direction="row"
                    display="flex"
                    style={{marginTop: '0.5rem'}}
                >
                    <Grid item xs={0}>

                    </Grid>
                    <Grid item xs={4}>
                        <Button size="small" color="primary" style={{paddingLeft: '0'}} onClick={() => props.handleMissionDetailsOpen(props.index)}>Szczegóły</Button>
                    </Grid>
                    <Grid item xs={5} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button size="small" color="primary" style={{textAlign: 'right', paddingRight: '0'}} onClick={() => props.handleMissionClick(mission.id)} disabled={!props.isMissionActive || !props.leader}>Wyrusz!</Button>
                    </Grid>
                </Grid>
                <Divider style={{margin: '0.5rem 0'}}/>
                <Grid
                    container
                    direction="column"
                >
                    <Grid
                        container
                        direction="row"
                    >
                        
                        <Grid item>
                            <Typography
                                component="span"
                                variant="body1"
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
                        style={{margin: '0.1rem 0'}}
                    >
                        
                        <Grid item xs={3}>
                        
                            <Typography
                                component="span"
                                style={{display: 'inline-flex'}}
                                variant="body2"
                                color={props.appropriateLevel ? 'textPrimary' : 'error'}
                            >
                                {/* <img style= {{height: 20, width: 20}} src={levelIcon}/> */}
                                {`P: ${mission.level}`}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography
                                component="span"
                                style={{display: 'inline-flex'}}
                                variant="body2"
                                color={props.appropriatePlayers ? 'textPrimary' : 'error'}
                            >
                                {/* <img style= {{height: 20, width: 20}} src={playersIcon}/> */}
                                {`G: ${props.playersLabel(mission.minPlayers, mission.maxPlayers)}`}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        style={{margin: '0.1rem 0'}}
                    >
                        <Grid item xs={3}>
                            <RequiredAttribute variant="body2" attr={props.appropriateStrength} >{`S: ${props.totalStrength}/${mission.strength}`}</RequiredAttribute>
                        </Grid>
                        <Grid item xs={3}>
                            <RequiredAttribute variant="body2" attr={props.appropriateDexterity} >{`Z: ${props.totalDexterity}/${mission.dexterity}`}</RequiredAttribute>
                        </Grid>
                        <Grid item xs={3}>
                            <RequiredAttribute variant="body2" attr={props.appropriateMagic} >{`M: ${props.totalMagic}/${mission.magic}`}</RequiredAttribute> 
                        </Grid>
                        <Grid item xs={3}>
                            <RequiredAttribute variant="body2" attr={props.appropriateEndurance} >{`W: ${props.totalEndurance}/${mission.endurance}`}</RequiredAttribute>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        style={{margin: '0.2rem 0'}}
                    >
                        <Grid item>
                            <Typography 
                                variant='body2'
                                component="span"
                                style={{display: 'inline-flex', margin: '0 0.3rem 0 0'}}
                            >
                            {`A: `}  
                            </Typography>
                            
                            {mission.amulets ? (
                                mission.amulets.map(amulet => {

                                    return(
                                        <Typography 
                                            variant='body2'
                                            component="span"
                                            style={{display: 'inline-flex', margin: '0 0.2rem 0 0'}}
                                            key={amulet.itemModel.id}
                                        >
                                            {`${amulet.quantity}x`}
                                            <img style={{height: 20, width: 20, marginLeft: '0.1rem'}} src={require(`../../../assets/icons/items/${amulet.itemModel.imgSrc}`)} alt='icon'/>
                                            {` `}
                                        </Typography>
                                        )
                                    })
                                ):(null)
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Divider style={{margin: '0.5rem 0'}}/>
                <Grid 
                    container
                    direction='column'
                >
                    <Grid
                        container
                        direction="row"
                    >
                            
                        <Grid item>
                            <Typography
                                component="span"
                                variant="body1"
                                color="textPrimary"
                                style={{fontWeight: 'bold'}}
                            >
                                Nagrody
                            </Typography>
                        </Grid> 
                    </Grid>
                    {Object.keys(mission.awards).map((className)=> {
                        
                        return(
                            <Grid
                                container
                                direction="row"
                                style={{marginBottom: '0.2rem'}}
                            >
                                <Grid item xs={4}>
                                <Typography 
                                    variant='body2'
                                    component="span"
                                    style={{display: 'inline-flex', margin: '0 0.3rem 0 0'}}
                                >
                                    {`${classLabelsAny[className]}: `} 
                                </Typography>
                                </Grid>
                                <Grid item xs={8} style={{display: 'flex', alignItems: 'center'}}>
                                    {mission.awards[className].length && !mission.awardsAreSecret ? (
                                        <React.Fragment>
                                            {mission.awards[className].map((award)=>{
                                                let copies = []
                                                for(let i=0; i<award.quantity; i++){
                                                    const copy = <img style={{height: 20, width: 20, marginLeft: '0.1rem'}} src={require(`../../../assets/icons/items/${award.itemModel.imgSrc}`)} alt='icon'/>
                                                    copies = [...copies, copy]
                                                }
                                                return copies
                                            })}
                                        </React.Fragment>
                                    ) : (
                                        <Typography 
                                            variant='body2'
                                            component="span"
                                            style={{display: 'inline-flex', margin: '0 0.3rem 0 0'}}
                                        >
                                            ?
                                        </Typography>
                                    )
                                    }
                                </Grid>
                            </Grid>
                        )
                            
                        })
                    }
                    
                </Grid>
            </Grid>
            </StyledBox>
    )
}

export default MissionListItem