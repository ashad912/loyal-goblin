import React from 'react'
import List from "@material-ui/core/List";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {perkLabels, dayLabels} from '../../../utils/labels'
import { getValue, getTarget } from '../../../utils/methods';




const StyledPaper = styled(Paper)`
    padding: 0.5rem;
    border: 1px solid #eeeeee;
`
const StyledBox = styled(Box)`
    margin: 0.5rem 0.5rem 0.5rem 0.5rem;
    text-align: center;

`
const HeadersContainer = styled.div`
    margin: 0.5rem 0.5rem 0.5rem 0.5rem;
    padding: 0.25rem 1rem 0.25rem 1rem;
    
    
`


const PerkListBox = (props) => {

    return(
        <Grid item xs={12}>
              <StyledPaper elevation={0}>
                  {props.headers && <HeadersContainer>
                      <Typography style={{width: '100%', color: 'rgba(0, 0, 0, 0.54)', fontSize: '0.8rem'}}>
                      <Grid container>
                        <Grid item xs={props.typeWidth}>
                          Typ efektu
                        </Grid>
                        <Grid item xs={props.valueWidth}>
                          Efekt
                        </Grid>
                        <Grid item xs={props.targetWidth}>
                          Zakres zniżki
                        </Grid>
                        <Grid item xs={props.timeWidth}>
                          {'Czas(y) działania efektu'}
                        </Grid>
                        <Grid item xs={props.breakWidth}>
                        </Grid>
                        {props.actions && <Grid item xs={props.actionsWidth}></Grid>}
                      </Grid>
                      </Typography>
                  </HeadersContainer>}
                  <List dense style={{maxHeight: '8rem', overflow: 'auto', width: '100%'}}>
                    
                      {props.perks.map((perk, index) => {
                 
                          return(
                            <StyledBox border={1} borderColor="primary.main">
                              <ListItem>
                                <Typography style={{width: '100%', fontSize: '0.8rem', textAlign: 'center'}} >
                                <Grid container>
                                  <Grid item xs={props.typeWidth}>
                                    {perkLabels[perk.perkType]}
                                  </Grid>
                                  <Grid item xs={props.valueWidth}>
                                    {getValue(perk.perkType, perk.value)}
                                  </Grid>
                                  <Grid item xs={props.targetWidth}>
                                    {getTarget(perk.perkType, perk.target)}
                                  </Grid>
                                  <Grid item xs={props.timeWidth}>
                                    {perk.time.length ? (
                                      <React.Fragment>
                                        {perk.time.slice().reverse().map((period)=>(
                                        <Grid container style={{justifyContent: 'center'}}>
                                          <Grid item>
                                            {`${dayLabels[period.startDay]}`}
                                          </Grid>
                                          {!(period.startHour === 12 && period.lengthInHours === 24) ? (
                                            <Grid item>
                                              {`, ${period.startHour}:00 - ${(period.startHour + period.lengthInHours) % 24}:00`}
                                            </Grid>
                                          ) : (
                                            null
                                          )}
                                        </Grid>
                                        ))}
                                      </React.Fragment>
                                    ) : (
                                      <span>Stały</span>
                                    )}
                                    
                                  </Grid>
                                
                                
                                  <Grid item xs={props.breakWidth}>
                                    
                                  </Grid>
                                  {props.actions && <Grid item xs={2} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                      
                                    <Button
                                        style={{marginRight: '0.5rem', height: '2.5rem'}}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => props.handleModifyPerk(index)}>
                                          <CreateIcon />
                                    </Button>
                                    <Button
                                      style={{height: '2.5rem'}}
                                      variant="contained"
                                      color="primary"
                                      onClick={() => props.handleDeletePerk(index)}>
                                          <DeleteIcon />
                                    </Button>
                                  </Grid>}
                                </Grid>
                                </Typography>
                              </ListItem>
                              
                              
                              </StyledBox>
                          )
                      })}
                  </List>
                  </StyledPaper>
                  </Grid>        
    )
}

export default PerkListBox