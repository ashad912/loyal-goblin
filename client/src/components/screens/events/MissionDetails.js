import React from 'react'
import Dialog from "@material-ui/core/Dialog";
import Collapse from "@material-ui/core/Collapse";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Badge from "@material-ui/core/Badge";
import styled from 'styled-components'
import AwardListItem from './AwardListItem'
import { classLabelsAny } from '../../../utils/labels';
import {palette, itemsPath, missionsPath} from '../../../utils/definitions'



const RequiredAttribute = styled(Typography)`
    margin: 0 0.5rem 0 0;
    color: ${props => props.attr ? 'green' : 'red' } ;
`
const Background = styled.div`
    background-color: ${palette.primary.main};
    color: white;
`

const StyledBadge = styled(Badge)`
    margin-right: ${props => props.invisible ? '0rem' : '1rem'};
`


const MissionDetails = (props) => {

    const mission = props.mission
    
    const [openList, setOpenList] = React.useState("");

    const handleOpenList = (event) => {
        if(!mission.awardsAreSecret){
            if (event.currentTarget.dataset.value === openList) {
                setOpenList("");
              } else {
                setOpenList(event.currentTarget.dataset.value);
              }
        }

      };


    return(
        <Dialog
            open={Boolean(props.open)}
            onClose={props.handleClose}
            fullWidth
            style={{margin: '-40px -40px 10px -40px'}}
            maxWidth="lg"
        >
        <Background>
            <DialogContent style={{paddingTop: '2rem', paddingBottom: '2rem', maxHeight: '31vh'}}>
                <Grid
                    container
                    direction="column"
                    style={{textAlign: 'left'}}
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
                                        variant="h5"
                                        
                                    >
                                        {mission.title}
                                    </Typography>
                                </Grid>
                                <Grid item >
                                    <Typography
                                        component="p"
                                        variant="body2"
                                        
                                    >
                                        {mission.description}
                                    </Typography>
                                </Grid>
                            </Grid>   
                        </Grid> 
                        <Grid item xs={3} >
                            <Grid
                                container
                                direction="column"
                            >
                                <Grid item style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Avatar alt="avatar" style={{width: '3.5rem', height: '4rem'}} src={`${missionsPath}${mission.imgSrc}`} />
                                </Grid>
                            </Grid>
                        </Grid> 
                    </Grid>
                    

                </Grid>
            </DialogContent>
        </Background>


        <DialogContent style={{paddingTop: '1rem', paddingBottom: '1rem'}}>

            <Grid
                container
                direction="column"
            >
                <Grid
                    container
                    direction="row"
                    style={{marginBottom: '0.4rem'}}
                >
                    
                    <Grid item>
                        <Typography
                            component="span"
                            variant="h6"
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
                            variant="body1"
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
                            variant="body1"
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
                        <RequiredAttribute variant="body1" attr={props.appropriateStrength ? 1:0} >{`S: ${props.totalStrength}/${mission.strength}`}</RequiredAttribute>
                    </Grid>
                    <Grid item xs={3}>
                        <RequiredAttribute variant="body1" attr={props.appropriateDexterity ? 1:0} >{`Z: ${props.totalDexterity}/${mission.dexterity}`}</RequiredAttribute>
                    </Grid>
                    <Grid item xs={3}>
                        <RequiredAttribute variant="body1" attr={props.appropriateMagic ? 1:0} >{`M: ${props.totalMagic}/${mission.magic}`}</RequiredAttribute> 
                    </Grid>
                    <Grid item xs={3}>
                        <RequiredAttribute variant="body1" attr={props.appropriateEndurance ? 1:0} >{`W: ${props.totalEndurance}/${mission.endurance}`}</RequiredAttribute>
                    </Grid>
                </Grid>
                
                <Grid
                    container
                    direction="row"
                    style={{margin: '0.2rem 0'}}
                >
                    {mission.amulets && mission.amulets.length > 0 &&
                    <Grid item>
                        <Typography 
                            variant='body1'
                            component="span"
                            style={{display: 'inline-flex', margin: '0 0.3rem 0 0'}}
                        >
                        {mission.amulets && mission.amulets.length > 0 && `Wymagane trofea: `} 
                        </Typography>
                        
                        {mission.amulets.map(amulet => {
                            return (
                                <StyledBadge
                                    color="primary"
                                    badgeContent={amulet.quantity}
                                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                                    style={{transform: 'scale(0.9)' }}
                                    invisible={amulet.quantity <= 1}
                                >
                                <Typography
                                    variant="body2"
                                    component="div"
                                    style={{
                                        display: "inline-flex",
                                        margin: "0 0.2rem 0 0"
                                    }}
 
                                >
                                <img
                                    style={{
                                        height: 20,
                                        width: 20,
                                        marginLeft: "0.1rem"
                                    }}
                                    src={`${itemsPath}${amulet.itemModel.imgSrc}`}
                                    alt="icon"
                                />
                                {` `}
                                </Typography>
                                </StyledBadge>
                            );
                        })}
                    </Grid>}
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
                            variant="h6"
                            color="textPrimary"
                            style={{fontWeight: 'bold'}}
                        >
                            Nagrody
                        </Typography>
                    </Grid> 
                </Grid>
                <Grid item style={{marginTop: '0.5rem'}}>
                {/*mission.hasOwnProperty('awards') &&*/ Object.keys(mission.awards).map((className)=> {
  
                    return(
                        <Grid
                        key={className}
                            container
                            direction="column"
                            style={{marginBottom: '0.2rem'}}

                        >
                            <Grid item>
                                <ListItem style={{paddingLeft: '0' , paddingRight: '0'}} onClick={handleOpenList} data-value={className}>
                                    <ListItemText primary={classLabelsAny[className]} />
                                    {mission.awardsAreSecret ? (<Typography>?</Typography>) : (openList === className ? <ExpandLess /> : <ExpandMore />)}
                                </ListItem>
                                <Collapse
                                    in={openList === className}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <Grid item xs={12} style={{display: 'flex', alignItems: 'center'}}>
                                        {mission.awards[className].length && !mission.awardsAreSecret ? (
                                            <Grid item style={{width: '100%'}}>
                                                <List component="div" disablePadding >
                                                    {mission.awards[className].map((award)=>{
                                                        return (
                                                            
                                                            <AwardListItem key={award.itemModel._id} item={award} />
                                                            
                                                        )
                                                    })}
                                                    
                                                </List>
                                                </Grid>
                                        ) : (
                                            null
                                        )}
                                    </Grid>
                                </Collapse>
                            </Grid>
                        </Grid>
                    )
                        
                    })
                }
                </Grid>
            </Grid>
        </DialogContent>


        
        <DialogActions style={{justifyContent: 'space-between'}}>
            
            <Button onClick={props.handleClose} color="secondary">
                Zamknij
            </Button>
            {props.activeInstanceId !== null && (props.leader || props.party.members.length === 0) && (<Button color="secondary" onClick={() => props.handleMissionLeave()}>Opuść</Button>)}
            <Button variant="contained" color="primary" onClick={() => props.handleMissionClick(mission._id)} disabled={props.multipleSession || !props.isMissionActive || (!props.leader && !props.activeInstanceId)}>{props.activeInstanceId ? 'Dołącz!' : 'Wyrusz!'}</Button>
        </DialogActions>
        </Dialog>
    )
}

export default MissionDetails