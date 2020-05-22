import React from 'react'
import Dialog from "@material-ui/core/Dialog";
import Collapse from "@material-ui/core/Collapse";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AwardListItem from '../../AwardListItem'
import { classLabelsAny } from '../../../../utils/labels';
import {palette, uiPaths,  missionsPath} from '../../../../utils/definitions'
import {PintoTypography} from '../../../../utils/fonts'
import DetailsHeader from '../DetailsHeader'
import MissionAwardsHeader from './MissionAwardsHeader'
import MissionRequirements from './MissionRequirements';
import AwardsSections from '../AwardsSections';
import DetailsSchema from '../DetailsSchema'


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