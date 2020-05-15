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
import { ralliesPath, palette, uiPaths } from '../../../utils/definitions'
import {PintoTypography} from '../../../utils/fonts'
import DetailsHeader from './DetailsHeader'

const Background = styled.div`
    background-color: ${palette.primary.main};
    color: white;
`

const AwardsLevelButton = styled(({...otherProps})=> (
    <Button  {...otherProps}/>
))`
    background-color: ${props => props.chosen ? palette.primary.main : palette.primary.contrastText } !important;
    color: ${props => props.chosen ? palette.primary.contrastText : 'black'}!important;

`


const RallyDetails = (props) => {

    const rally = props.rally


    const [openList, setOpenList] = React.useState("");
    

    const [levelList, setLevelList] = React.useState(rally.awardsLevels.length ? 0 : null);


    const handleOpenList = (event, level) => {
        if (event.currentTarget.dataset.value === openList) {
            setOpenList("");
        } else {
            setOpenList(event.currentTarget.dataset.value);   
        }
    };

    const handleChangeLevelList = (e, level) => {
        setLevelList(level)
    }

    const activeAwardsLevel = rally.awardsLevels[levelList]

    return(
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            fullWidth
            style={{margin: '-40px', zIndex: 1500}}
            maxWidth="lg"
        >
            <DetailsHeader
                title={rally.title}
                description={rally.description}
                imgSrc={`${ralliesPath}${rally.imgSrc}`}
            />


        <DialogContent style={{padding: '0.5rem 1rem', minHeight: '122px'}}>

            <Grid 
                container
                direction='column'      
            >
                {!rally.awardsAreSecret &&
                    <React.Fragment>
                        <Grid
                            container
                            style={{flexFlow: 'row nowrap', marginBottom: '0.5rem'}}
                        >
                                
                            <Grid item container alignItems='center' style={{flexBasis: '30%'}} >
                                <Grid item >
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
                            <Grid 
                                item 
                                container
                                direction="row" 
                                style={{flexFlow: 'row wrap', flexBasis: '70%'}}
                            >
                                {rally.awardsLevels.sort((a, b)=> (a.level > b.level) ? 1 : -1).map((awardsLevel, index) => {
                                        return(
                                            <Grid item style={{padding: '4px', margin: '0 auto'}}>
                                                <AwardsLevelButton 
                                                    variant="contained" 
                                                    style={{padding: '3px', }} 
                                                    chosen={index===levelList ? 1 : 0}
                                                    backgroundColor={index === levelList ? (palette.primary.main) : (palette.primary.contrastText)} 
                                                    onClick={(e) => handleChangeLevelList(e, index)}>
                                                        <PintoTypography>{awardsLevel.level} PD</PintoTypography>
                                                </AwardsLevelButton>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid> 
                        </Grid>
                        <Divider style={{backgroundColor: palette.background.darkGrey, height: '0.5px', 'marginLeft': '-1rem'}}/>
                    </React.Fragment>
                }
                </Grid>
            </DialogContent>
            
            <DialogContent style={{padding: '0.5rem 1rem'}}>
            <Grid 
                container
                direction='column'      
            >
                <Grid item style={{marginTop: '0.5rem'}}>
                {!rally.awardsAreSecret && (
                    <React.Fragment>
                        {Object.keys(activeAwardsLevel.awards).map((className) => {
                            return(
                                <Grid item>
                                    {activeAwardsLevel.awards[className].length > 0 && (
                                        <React.Fragment>
                                            <ListItem style={{paddingLeft: '0', paddingRight: '0'}} onClick={(event) => handleOpenList(event, activeAwardsLevel.level)} data-value={className}>
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
                                                        {openList === className ? <ExpandLess style={{color: palette.background.grey}}/> : <ExpandMore style={{color: palette.background.darkGrey}}/>}
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                            <Collapse
                                                in={openList === className}
                                                timeout="auto"
                                                unmountOnExit
                                                
                                            >
                                                <Grid item xs={12} style={{display: 'flex', alignItems: 'center'}}>
                                                    
                                                    <Grid item style={{width: '100%'}}>
                                                        <List component="div" disablePadding >
                                                            {activeAwardsLevel.awards[className].map((award)=>{
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

                        
                    </React.Fragment>      
                )
                }
                {rally.awardsAreSecret && (
                    <Typography variant="h6" align='center'> Nie mamy informacji o nagrodach, które można zdobyć!</Typography>
                )}
                </Grid>
            </Grid>
        </DialogContent>
        <div>
            {levelList !== 0 && 
                <ListItem style={{textAlign: 'center'}}>
                    <ListItemText disableTypography >
                        <Typography style={{fontSize: '0.75em'}}>oraz nagrody z niższych progów</Typography>
                    </ListItemText>
                </ListItem>
            }
        </div>
        
        <DialogActions style={{justifyContent: 'flex-end'}}>
            <Button onClick={props.handleClose}  color="primary">
                <PintoTypography>Zamknij</PintoTypography>
            </Button>
        </DialogActions>
        </Dialog>
    )
}

export default RallyDetails