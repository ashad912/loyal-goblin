import React, {useState}  from 'react'
import moment from 'moment'
import { Redirect, useHistory} from 'react-router-dom'
import { connect } from 'react-redux'
import VisibilitySensor from 'react-visibility-sensor'
import MissionDetails from './mission/MissionDetails'
import RallyDetails from './rally/RallyDetails'
import MissionListItem from './mission/MissionListItem'
import withMissionItemCommon from '../../../hoc/withMissionItemCommon'
import List from '@material-ui/core/List';


import Typography from '@material-ui/core/Typography';
import styled from 'styled-components'

import {getMissionList, createInstance, deleteInstance} from '../../../store/actions/missionActions.js'

import Rally from './rally/Rally'
import { getFirstRally } from '../../../store/actions/rallyActions'
import { authCheck } from "../../../store/actions/authActions";

import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';


const itemLabelHeight = 451.6 //REFACTOR: need to be changed to 'dimensionLabel'



const StyledList = styled(List)`
    width: 100%;
    margin: 0 0 1rem 0;
`




const Events = (props) => {

    const [activeMissionDetails, setActiveMissionDetails] = useState(null)
    const [activeRallyDetails, setActiveRallyDetails] = useState(null)

    const history = useHistory()

    const fetchMissions = async () => {
        
        await props.getMissionList()
    }

    const fetchRally = async () => {
         await props.getFirstRally() //return Object or 'undefined'
    }

    //https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
    // const itemRef = React.useCallback(node => {
    //     console.log(node)
    //     if(node !== null){
    //         setItemHeight(node.clientHeight)
    //     }
    // }, [])



    const openInstance = (id) => {
        history.push("/mission", { id });
    }


    const handleMissionCreate = async (id) => {
        try{

            const mInstance = await props.createInstance(id, props.party._id) //shot to backend - verify party quantity and leader status (amulets verifed inside the mission), redirect to mission
            openInstance(mInstance.mission)
                
        }catch(e){
            //console.log(e)
            fetchMissions()
        }
        
    }

    const handleMissionClick = async (id) => {
        if(!props.activeMissionId){
            
            props.handleWarning(
                () => handleMissionCreate(id),
                "Rozpoczęcie misji"
                )
            
            
        }else{
            openInstance(id)
        }  
    }

    const handleRefresh = () => {
        fetchMissions()
        fetchRally()
    }

    const handleMissionLeave = async () => {
        await props.deleteInstance(props.party._id) 
    }

    const handleMissionDetailsOpen = (index) => {
        setActiveMissionDetails(props.missionListData[index])
    }

    const handleMissionDetailsClose = () => {
        setActiveMissionDetails(null)
    }

    const handleRallyDetailsOpen = () => {
        setActiveRallyDetails(props.rally)
    }

    const handleRallyDetailsClose = () => {
        setActiveRallyDetails(null)
    }

    
    //for better perfomance uses VisibilitySensor to load only visible (or partly visible) elements
    //to work need fixed listem item size (which is ok, i believe)
    const missionList = props.missionListData ? (
        props.missionListData.map((mission, index) => {
            const MissionListItemHoc = withMissionItemCommon(MissionListItem, mission)
            return(
                <VisibilitySensor partialVisibility key={mission._id}>
                {({isVisible}) =>
                    <div>{isVisible ? ( /*inVisible defined only inside div which is fucking kurwa crazy */
                        <MissionListItemHoc
                            index={index}
                            activeMissionId = {props.activeMissionId}
                            handleMissionClick={handleMissionClick}
                            handleMissionDetailsOpen={handleMissionDetailsOpen}
                            handleMissionLeave={handleMissionLeave}
                            multipleSession={props.multipleSession}
                            
                        />   
                    ) : (<div style={{height: itemLabelHeight}}></div>)   /*empty div with the same height - IMPORTANT */
                    }
                    </div>
                }   
                </VisibilitySensor>
            )
        })
    ) : ( null )


    const MissionDetailsHoc = activeMissionDetails ? (withMissionItemCommon(MissionDetails, activeMissionDetails)) : (null)

    return (
        
        <React.Fragment>

            {props.rally !== null && (
                <Rally rally={props.rally} handleRallyDetailsOpen={handleRallyDetailsOpen} handleRallyDetailsClose={handleRallyDetailsClose} refreshProfile={() => props.authCheck()}/>
            )}

            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <IconButton
                    onClick={handleRefresh}
                    aria-label="Odśwież"
                    style={{padding: '0.5rem'}}
                >
                    <RefreshIcon/>
                </IconButton>
                <Typography variant="h6">
                    {missionList.length ? (props.activeMissionId ? 'Aktywna misja' : 'Dostępne misje') : 'Brak dostępnych misji!'}
                </Typography>
            </div>
            
           
            <StyledList> 
                {missionList}
            </StyledList>
            
                
            {activeMissionDetails && 
                <MissionDetailsHoc
                    open={activeMissionDetails ? true : false}
                    activeMissionId = {props.activeMissionId}
                    handleClose={handleMissionDetailsClose}
                    handleMissionClick={handleMissionClick}
                    handleMissionLeave={handleMissionLeave}
                    multipleSession={props.multipleSession}
                />
            }
            {activeRallyDetails && 
                <RallyDetails
                    open={activeRallyDetails ? true : false}
                    rally={activeRallyDetails}
                    handleClose={handleRallyDetailsClose}
                />
            }    

        </React.Fragment>
      
    )
}

const mapStateToProps = state => {
    return {
        rally: state.rally.rally,
        activeOrder: state.auth.profile.activeOrder,
        missionListData: state.mission.missions,
        activeMissionId: state.mission.activeInstanceId,
        multipleSession: state.auth.multipleSession,
        party: state.party
    };
  };

const mapDispatchToProps = dispatch => {
    return {
        authCheck: () => dispatch(authCheck()),
        getMissionList : () => dispatch(getMissionList()),
        getRally: () => dispatch(getFirstRally()),
        createInstance: (id, partyId) => dispatch(createInstance(id, partyId)),
        deleteInstance: (partyId) => dispatch(deleteInstance(partyId))
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Events)
