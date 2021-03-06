import React, {useState}  from 'react'
import { useHistory} from 'react-router-dom'
import { connect } from 'react-redux'
import VisibilitySensor from 'react-visibility-sensor'
import styled from 'styled-components'

import List from '@material-ui/core/List';

import Rally from './rally/Rally'
import MissionDetails from './mission/MissionDetails'
import RallyDetails from './rally/RallyDetails'
import MissionListItem from './mission/MissionListItem'
import MissionListHeader from './mission/MissionListHeader'
import withMissionItemCommon from 'hoc/withMissionItemCommon'

import {getMissionList, createInstance, deleteInstance} from 'store/actions/missionActions.js'
import { getFirstRally } from 'store/actions/rallyActions'
import { authCheck } from "store/actions/authActions";
import { setCheckWarning } from 'store/actions/communicationActions'

import { warningActionSources } from 'utils/constants'


const itemLabelHeight = 451.6 //REFACTOR: need to be changed to 'dimensionLabel'


const StyledList = styled(List)`
    width: 100%;
    margin: 0 0 1rem 0;
`



const Events = (props) => {

    const [activeMissionDetails, setActiveMissionDetails] = useState(null)
    const [activeRallyDetails, setActiveRallyDetails] = useState(null)

    const history = useHistory()

    //https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
    // const itemRef = React.useCallback(node => {
    //     console.log(node)
    //     if(node !== null){
    //         setItemHeight(node.clientHeight)
    //     }
    // }, [])

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
            
            props.setCheckWarning(
                () => handleMissionCreate(id),
                "Rozpoczęcie misji",
                warningActionSources.mission
            )
            
            
        }else{
            openInstance(id)
        }  
    }

    const openInstance = (id) => {
        history.push("/mission", { id });
    }

    const handleRefresh = () => {
        fetchMissions()
        fetchRally()
    }

    const fetchMissions = async () => {
        
        await props.getMissionList()
    }

    const fetchRally = async () => {
         await props.getRally() //return Object or 'null'
    }

    const handleMissionLeave = async () => {
        await props.deleteInstance(props.party._id) 
    }

    const handleMissionDetailsOpen = (index) => {
        setActiveMissionDetails(props.missionListData[index])
    }

    const handleMissionDetailsClose = (callback) => {
        setActiveMissionDetails(null)
        if(callback){
            callback()
        }
        
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
                    <div>{isVisible ? ( /*inVisible defined only inside div */
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

            <MissionListHeader 
                missionListLength={missionList.length}
                activeMissionId={props.activeMissionId}
                handleRefresh={handleRefresh}
            />
            
           
            <StyledList> 
                {missionList}
            </StyledList>
            
                
            {activeMissionDetails && 
                <MissionDetailsHoc
                    open={activeMissionDetails ? true : false}
                    activeMissionId = {props.activeMissionId}
                    handleClose={() => handleMissionDetailsClose()}
                    handleMissionClick={handleMissionClick}
                    handleMissionLeave={() => handleMissionDetailsClose(handleMissionLeave)}
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
        rally: state.rally,
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
        deleteInstance: (partyId) => dispatch(deleteInstance(partyId)),
        setCheckWarning: (action, text, actionType) => dispatch(setCheckWarning(action, text, actionType))
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Events)
