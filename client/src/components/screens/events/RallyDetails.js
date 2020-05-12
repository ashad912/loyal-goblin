import React from 'react'
import { Typography } from '@material-ui/core'
import { List } from '@material-ui/core'
import { ListItemText } from '@material-ui/core'
import { ListItem } from '@material-ui/core'
import { Button } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Dialog from "@material-ui/core/Dialog";
import Collapse from "@material-ui/core/Collapse";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import styled from 'styled-components'

import AwardListItem from './AwardListItem'
import { classLabelsAny } from '../../../utils/labels';
import { ralliesPath, palette } from '../../../utils/definitions'
import {PintoTypography} from '../../../utils/fonts'

const Background = styled.div`
    background-color: ${palette.primary.main};
    color: white;
`


const RallyDetails = (props) => {

    const rally = props.rally


    const [openList, setOpenList] = React.useState("");
    

    const [levelList, setLevelList] = React.useState(rally.awardsLevels.length ? 0 : null);

    // const handleOpenList = (event, level) => {
    //     if (event.currentTarget.dataset.value === openList && levelList === level) {
    //         setOpenList("");
    //         setLevelList(null)
    //     } else {
    //         setOpenList(event.currentTarget.dataset.value);
    //         setLevelList(level)
    //     }
    // };

    const handleOpenList = (event, level) => {
        if (event.currentTarget.dataset.value === openList && levelList === level) {
            setOpenList("");
            setLevelList(null)
        } else {
            setOpenList(event.currentTarget.dataset.value);
            setLevelList(level)
        }
    };

    const handleChangeLevelList = (e, level) => {
        setLevelList(level)
    }


    return(
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            fullWidth
            style={{margin: '-40px'}}
            maxWidth="lg"
        >
        <Background>
            <DialogContent style={{padding: '2rem 1rem', maxHeight: '31vh'}}>
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
                                {rally.title}
                            </Typography>
                        </Grid>
                        <Grid item /*style={{textAlign: 'justify'}}*/> 
                            <PintoTypography
                                component="p"
                                variant="body2"
                                style={{color: 'black'}}
                            >
                                {rally.description}
                            </PintoTypography>
                        </Grid>
                        </Grid>   
                    </Grid> 
                    <Grid item xs={3} >
                        <Grid
                            container
                            direction="column"
                        >
                            <Grid item style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Avatar alt="avatar" style={{width: '5rem', height: '5rem', borderRadius: '0'}} variant="square"  src={`${ralliesPath}${rally.imgSrc}`} />
                            </Grid>
                        </Grid>
                    </Grid>
                    

                </Grid>
                </Grid>
            </DialogContent>
        </Background>


        <DialogContent style={{padding: '0.5rem 1rem'}}>

            <Grid 
                container
                direction='column'
            >
                <Grid
                    container
                    direction="row"
                >
                        
                    <Grid item xs={4}>
                        <Typography
                            component="span"
                            variant="h6"
                            color="textPrimary"
                            style={{fontWeight: 'bold'}}
                        >
                            Nagrody
                        </Typography>
                    </Grid> 
                    <Grid item xs={8} style={{flexFlow: 'row wrap'}}>
                        {!rally.awardsAreSecret && rally.awardsLevels.sort((a, b)=> (a.level > b.level) ? 1 : -1).map((awardsLevel, index) => {
                                return(
                                    <Grid item xs={4} style={{padding: '8px'}}>
                                        <Button variant="contained" color={index !== levelList ? 'primary' : 'white'} handleClick={(e) => handleChangeLevelList(e, index)}>
                                            {awardsLevel.level} PD
                                        </Button>
                                    </Grid>
                                )
                            })
                        }
                    </Grid> 
                </Grid>
                <Grid item style={{marginTop: '0.5rem'}}>
                {!rally.awardsAreSecret && rally.awardsLevels.sort((a, b)=> (a.level > b.level) ? 1 : -1).map((awardsLevel, index) => {
                    
                    return(
                        <Grid
                            container
                            direction="column"
                            style={{marginBottom: '0.2rem'}}

                        >
                            <ListItem style={{paddingLeft: '0' , paddingRight: '0'}} >
                                <Typography variant="h6">Jeśli zdobędziesz {awardsLevel.level} PD</Typography>
                            </ListItem>
                            {Object.keys(awardsLevel.awards).map((className) => {
                                return(
                                    <Grid item>
                                        {awardsLevel.awards[className].length > 0 && (
                                            <React.Fragment>
                                                <ListItem style={{paddingRight: '0'}} onClick={(event) => handleOpenList(event, awardsLevel.level)} data-value={className}>
                                                    <ListItemText primary={classLabelsAny[className]} />
                                                    {openList === className && levelList === awardsLevel.level ? <ExpandLess /> : <ExpandMore />}
                                                </ListItem>
                                                <Collapse
                                                    in={openList === className && levelList === awardsLevel.level}
                                                    timeout="auto"
                                                    unmountOnExit
                                                >
                                                    <Grid item xs={12} style={{display: 'flex', alignItems: 'center'}}>
                                                        
                                                        <Grid item style={{width: '100%'}}>
                                                            <List component="div" disablePadding >
                                                                {awardsLevel.awards[className].map((award)=>{
                                                                    return (
                                                                        
                                                                        <AwardListItem key={award.itemModel._id} item={award} />
                                                                        
                                                                    )
                                                                })}
                                                                
                                                            </List>
                                                            </Grid>
                                                        
                                                    </Grid>
                                                </Collapse>
                                                </React.Fragment>
                                        )}
                                        
                                    
                                    
                                    </Grid>
                                )
                            })}
                            {index !== 0 && 
                                <ListItem style={{paddingRight: '0'}}>
                                    <ListItemText primary={'oraz łupy z niższych progów.'} style={{fontStyle: 'italic'}}/>
                                </ListItem>
                            }
                        </Grid>
                    )
                        
                    })
                }
                {rally.awardsAreSecret && (
                    <Typography variant="h6"> Nie mamy informacji o łupach które można zdobyć!</Typography>
                )}
                </Grid>
            </Grid>
        </DialogContent>


        
        <DialogActions style={{justifyContent: 'flex-end'}}>
            <Button onClick={props.handleClose}  color="primary">
                <PintoTypography>Zamknij</PintoTypography>
            </Button>
        </DialogActions>
        </Dialog>
    )
}

export default RallyDetails