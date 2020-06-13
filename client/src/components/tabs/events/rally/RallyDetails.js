import React from 'react'
import styled from 'styled-components'

import { Typography } from '@material-ui/core'
import { ListItemText } from '@material-ui/core'
import { ListItem } from '@material-ui/core'
import { Button } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import DetailsSchema from '../DetailsSchema'
import DetailsHeader from '../DetailsHeader'
import AwardsSections from '../AwardsSections'

import { ralliesPath, palette } from 'utils/constants'
import {PintoTypography} from 'assets/fonts'



const AwardsLevelButton = styled(({...otherProps})=> (
    <Button  {...otherProps}/>
))`
    padding: 3px;
    ${props => {
        if(!props.disabled){
            if(props.chosen){
                return (
                    `
                        background-color: ${palette.primary.main} !important;
                        color: ${palette.primary.contrastText} !important;
                    `
                )
                    
            }else{
                return (
                    `  
                        background-color: ${palette.primary.contrastText} !important;
                        color: black !important;
                    `
                )
                
            }
        }
        
    }}
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

    const awardsHeader = (
        <Grid 
            container
            direction='column'      
        >
            
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
                                        <Grid 
                                            key={index}
                                            item 
                                            style={{padding: '4px', margin: '0 auto'}}
                                        >
                                            <AwardsLevelButton 
                                                variant="contained" 
                                                disabled={rally.awardsAreSecret}
                                                chosen={index === levelList ? 1 : 0}
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
            
        </Grid>
    )

    const awardsFooter = (
        <div>
            {levelList !== 0 && 
                <ListItem style={{textAlign: 'center'}}>
                    <ListItemText disableTypography >
                        <Typography style={{fontSize: '0.75em'}}>oraz nagrody z niższych progów</Typography>
                    </ListItemText>
                </ListItem>
            }
        </div>
    )

    return(
        <DetailsSchema 
            open={props.open}
            handleClose={props.handleClose}
            header={
                <DetailsHeader
                    title={rally.title}
                    description={rally.description}
                    imgSrc={`${ralliesPath}${rally.imgSrc}`}
                />
            }
            minHeaderHeight='max-content'
            awardsHeader={awardsHeader}
            awardsSections= {
                <AwardsSections 
                    awards={rally.awardsLevels[levelList].awards}
                    awardsAreSecret={rally.awardsAreSecret} 
                    openList={openList}
                    handleOpenList={handleOpenList}
                />
            }
            awardsFooter={awardsFooter}
            footer={
                <Button onClick={props.handleClose}  color="primary">
                    <PintoTypography>Zamknij</PintoTypography>
                </Button>
            }
            footerJustify='flex-end'
        />     
    )
}

export default RallyDetails