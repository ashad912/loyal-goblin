import React from 'react'
import Button from "@material-ui/core/Button";

import DetailsHeader from '../DetailsHeader'
import MissionAwardsHeader from './MissionAwardsHeader'
import MissionRequirements from './MissionRequirements';
import AwardsSections from '../AwardsSections';
import DetailsSchema from '../DetailsSchema'


import {missionsPath} from 'utils/constants'
import {PintoTypography} from 'assets/fonts'


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

        <DetailsSchema 
            open={props.open}
            handleClose={props.handleClose}
            header={
                <DetailsHeader
                    title={mission.title}
                    description={mission.description}
                    imgSrc={`${missionsPath}${mission.imgSrc}`}
                />
            }
            minHeaderHeight='177px'
            awardsHeader={
                <MissionAwardsHeader 
                    variant='h6'
                />
            }
            requirements={
                <MissionRequirements 
                   
                    mission={mission}
                    titleMargin={'0 0 0.5rem 0'}
                    dataMargin={'0 0 0.5rem 0'}
                    headerVariant='h6'
                    bodyVariant='body1'
                    {...props}
                />
            }
            awardsSections= {
                <AwardsSections 
                    awards={mission.awards}
                    awardsAreSecret={mission.awardsAreSecret} 
                    openList={openList}
                    handleOpenList={handleOpenList}
                    alwaysShowSections
                />
            }
            footer={
                <React.Fragment>
                    <Button onClick={props.handleClose} color="secondary">
                        <PintoTypography>Zamknij</PintoTypography>
                    </Button>

                    {props.activeMissionId !== null && (props.leader || props.party.members.length === 0) && (
                        <Button color="secondary" onClick={() => props.handleMissionLeave()}>
                            <PintoTypography>Opuść</PintoTypography>
                        </Button>
                    )}

                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => props.handleMissionClick(mission._id)} disabled={props.multipleSession || !props.isMissionActive || (!props.leader && !props.activeMissionId)}>
                            <PintoTypography>{props.activeMissionId ? 'Dołącz' : 'Wyrusz'}</PintoTypography>
                    </Button>
                </React.Fragment>
            }
            footerJustify='space-between'
        />   
      
    )
}

export default MissionDetails