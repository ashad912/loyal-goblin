import React from 'react'
import PropTypes from 'prop-types'
import Collapse from "@material-ui/core/Collapse";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AwardListItem from './AwardListItem'
import { classLabelsAny } from '../../../utils/labels';
import {palette, uiPaths} from '../../../utils/definitions'

const AwardsSections = ({awards, awardsAreSecret, openList, handleOpenList, alwaysShowSections}) => {
    return(
        <Grid 
            container
            direction='column'
        >
            <Grid item style={{marginTop: '0.5rem'}}>
            {(alwaysShowSections || !awardsAreSecret) && Object.keys(awards).map((className)=> {

                return(
                    
                        <Grid item key={className}>
                            {(awards[className].length > 0 || (alwaysShowSections && awardsAreSecret)) && (
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
                                                {awardsAreSecret ? (<Typography>?</Typography>) : (openList === className ? <ExpandLess style={{color: palette.background.grey}}/> : <ExpandMore style={{color: palette.background.darkGrey}}/>)}
                                            </Grid>
                                        </Grid>
                                        
                                    </ListItem>
                                    <Collapse
                                        in={openList === className}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <Grid item xs={12} style={{display: 'flex', alignItems: 'center'}}>
                                            {awards[className].length && !awardsAreSecret ? (
                                                <Grid item style={{width: '100%'}}>
                                                    <List component="div" disablePadding >
                                                        {awards[className].map((award)=>{
                                                            return (
                                                                <AwardListItem 
                                                                    key={award.itemModel._id} 
                                                                    item={award}
                                                                    enableBackground
                                                                /> 
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
                    
                )
                    
                })
            }
            {!alwaysShowSections && awardsAreSecret && (
                <Typography variant="h6" align='center'> Nie mamy informacji o nagrodach, które można zdobyć!</Typography>
            )}
            </Grid>
        </Grid>
    )
}

AwardsSections.propTypes = {
    awards: PropTypes.object.isRequired,
    awardsAreSecret: PropTypes.bool,
    alwaysShowSections: PropTypes.bool,
    openList: PropTypes.string.isRequired,
    handleOpenList: PropTypes.func.isRequired,
}

export default AwardsSections