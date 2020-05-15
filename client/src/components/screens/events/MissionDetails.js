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
import {palette, uiPaths, itemsPath, missionsPath} from '../../../utils/definitions'
import {PintoTypography} from '../../../utils/fonts'
import DetailsHeader from './DetailsHeader'
import MissionAttribute from './MissionAttribute'
import MissionRequirements from './MissionRequirements';



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
            style={{margin: '-40px', zIndex: 1500}}
            maxWidth="lg"
        >
        <DetailsHeader
            title={mission.title}
            description={mission.description}
            imgSrc={`${missionsPath}${mission.imgSrc}`}
        />


        <DialogContent style={{padding: '0.5rem 1rem', minHeight: '177px'}}>
            <MissionRequirements 
                props={props}
                mission={mission}
                titleMargin={'0 0 0.5rem 0'}
                dataMargin={'0 0 0.5rem 0'}
                headerVariant='h6'
                bodyVariant='body1'
            />
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
            </Grid>
            </DialogContent>
            <DialogContent>
            <Grid 
                container
                direction='column'
            >
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
                                {(mission.awards[className].length > 0 || mission.awardsAreSecret) && (
                                    <React.Fragment>
                                        <ListItem style={{paddingLeft: '0' , paddingRight: '0'}} onClick={handleOpenList} data-value={className}>
                                        
                                            <Grid container>
                                                <Grid item xs={4} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                    <Typography variant='h6'>{classLabelsAny[className]}</Typography>
                                                </Grid>
                                                <Grid item xs={3} style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                                                    <img
                                                        src={uiPaths[className]}
                                                        width={42}
                                                        
                                                    />
                                                </Grid>
                                                <Grid item xs={5} style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                                                    {mission.awardsAreSecret ? (<Typography>?</Typography>) : (openList === className ? <ExpandLess style={{color: palette.background.grey}}/> : <ExpandMore style={{color: palette.background.darkGrey}}/>)}
                                                </Grid>
                                            </Grid>
                                            
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
                                    </React.Fragment>
                                )}
                                
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
                <PintoTypography>Zamknij</PintoTypography>
            </Button>
            {props.activeInstanceId !== null && (props.leader || props.party.members.length === 0) && (<Button color="secondary" onClick={() => props.handleMissionLeave()}><PintoTypography>Opuść</PintoTypography></Button>)}
            <Button variant="contained" color="primary" onClick={() => props.handleMissionClick(mission._id)} disabled={props.multipleSession || !props.isMissionActive || (!props.leader && !props.activeInstanceId)}><PintoTypography>{props.activeInstanceId ? 'Dołącz' : 'Wyrusz'}</PintoTypography></Button>
        </DialogActions>
        </Dialog>
    )
}

export default MissionDetails