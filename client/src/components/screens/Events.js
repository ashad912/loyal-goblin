import React, {useState}  from 'react'
import moment from 'moment'
import { Redirect} from 'react-router-dom'
import { connect } from 'react-redux'
import VisibilitySensor from 'react-visibility-sensor'
import MissionDetails from './events/MissionDetails'
import RallyDetails from './events/RallyDetails'
import MissionListItem from './events/MissionListItem'
import withMissionItemCommon from './events/hoc/withMissionItemCommon'
import List from '@material-ui/core/List';

import OrderWarningDialog from "./events/OrderWarningDialog";

import Typography from '@material-ui/core/Typography';
import styled from 'styled-components'

import {getMissionList, createInstance, deleteInstance, setActiveInstance} from '../../store/actions/missionActions.js'
import {socket, instanceRefreshSubscribe} from '../../socket'

import Rally from './events/Rally'
import { getFirstRally } from '../../store/actions/rallyActions'
import { authCheck } from "../../store/actions/authActions";

import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';


const itemLabelHeight = 451.6 //REFACTOR: need to be changed to 'dimensionLabel'



const StyledList = styled(List)`
    width: 100%;
    margin: 0 0 1rem 0;
`





function useDidUpdateEffect(fn, inputs) {
    const didMountRef = React.useRef(false);
  
    React.useEffect(() => {
      if (didMountRef.current)
        fn();
      else
        didMountRef.current = true;
    }, inputs);
  }


const Events = (props) => {


    const [missionId, setMissionId] = useState(null);
    const [activeMissionDetails, setActiveMissionDetails] = useState(null)
    const [activeRallyDetails, setActiveRallyDetails] = useState(null)
    const [missionListData, setMissionListData] = useState([])
    const [rally, setRally] = useState(null)

    const [
        orderWarningDialog,
        setOrderWarningDialog
      ] = React.useState({ action: null, text: "" });
    
    

    const fetchMissions = async () => {
        const missionObject = await getMissionList()
        
        setMissionListData(missionObject.missions)

        if(missionObject.missionInstanceId){
            const instanceIndex = missionObject.missions.findIndex((mission) => mission._id === missionObject.missionInstanceId)
            props.setActiveInstance(missionObject.missionInstanceId, missionObject.missions[instanceIndex].imgSrc)
        }else{
            props.setActiveInstance(null, null)
        }
        
        
        
        //updateActiveInstanceId(missionObject.missionInstanceId)
    }

    const fetchRally = async () => {
        const rally = await getFirstRally() //return Object or 'undefined'
        setRally(rally) 
    }


    React.useEffect(() => {
        
        fetchMissions()
        fetchRally()
        
    
        instanceRefreshSubscribe(async (roomId) => {
            //console.log('mission refreshed')
            fetchMissions()
            await props.authCheck()
            
        })

    }, []);

    // useDidUpdateEffect(() => {
    //     fetchMissions()
    // }, [props.party.members, props.party.leader])

    const handleOrderWarningDialog = (action, text) => {
        setOrderWarningDialog({ action, text });
      };

    const handleMissionCreate = async (id) => {
        try{

            const response = await createInstance(id, props.party._id) //shot to backend - verify party quantity and leader status (amulets verifed inside the mission), redirect to mission
            setMissionId(response.mission)
                
        }catch(e){
            //console.log(e)
            fetchMissions()
        }
        
    }

    const handleMissionClick = async (id) => {
        //console.log('clicked',  id) onClick={
        const isActiveOrder = props.activeOrder.length
        const isValidActiveOrder =
            isActiveOrder ? moment.utc().valueOf() < moment.utc(props.activeOrder[0].createdAt).add("5", "minutes").valueOf() : false
        if(!props.activeInstanceId){
            if(isValidActiveOrder){
                handleOrderWarningDialog(
                    () => handleMissionCreate(id),
                    "Rozpoczęcie misji"
                  )
            }else{
                handleMissionCreate(id)
             
            }
        }else{
            setMissionId(id)
        }
        
    }

    const handleRefresh = () => {
        fetchMissions()
        fetchRally()
    }

    const handleMissionLeave = async () => {
        await deleteInstance(props.party._id)
        if(!socket.connected){
            fetchMissions()
        }
       // console.log('leave')
    }

    const handleMissionDetailsOpen = (index) => {
        setActiveMissionDetails(missionListData[index])
    }

    const handleMissionDetailsClose = () => {
        setActiveMissionDetails(null)
    }

    const handleRallyDetailsOpen = () => {
        setActiveRallyDetails(rally)
    }

    const handleRallyDetailsClose = () => {
        setActiveRallyDetails(null)
    }

    //for better perfomance uses VisibilitySensor to load only visible (or partly visible) elements
    //to work need fixed listem item size (which is ok, i believe)
    const missionList = missionListData ? (
        missionListData.map((mission, index) => {
            const MissionListItemHoc = withMissionItemCommon(MissionListItem, mission)
            return(
                <VisibilitySensor partialVisibility key={mission._id}>
                {({isVisible}) =>
                    <div>{isVisible ? ( /*inVisible defined only inside div witch is fucking kurwa crazy */
                        <MissionListItemHoc
                            index={index}
                            activeInstanceId = {props.activeInstanceId}
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
           

            {missionId != null ?
             <Redirect to={{
                  pathname: '/mission',
                  state: { id: missionId}                                      
            }} /> : null}

            {rally !== null && (<Rally rally={rally} handleRallyDetailsOpen={handleRallyDetailsOpen} handleRallyDetailsClose={handleRallyDetailsClose} refreshProfile={() => props.authCheck()}/>)}

            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <IconButton
                    onClick={handleRefresh}
                    aria-label="Odśwież"
                    style={{padding: '0.5rem'}}
                >
                    <RefreshIcon/>
                </IconButton>
                <Typography variant="h6">
                    {missionList.length ? (props.activeInstanceId ? 'Aktywna misja' : 'Dostępne misje') : 'Brak dostępnych misji!'}
                </Typography>
            </div>
            
           
            <StyledList> 
                {missionList}
            </StyledList>
            
                
            {activeMissionDetails && 
                <MissionDetailsHoc
                    open={activeMissionDetails ? 1 : 0}
                    activeInstanceId = {props.activeInstanceId}
                    handleClose={handleMissionDetailsClose}
                    handleMissionClick={handleMissionClick}
                    handleMissionLeave={handleMissionLeave}
                    multipleSession={props.multipleSession}
                />
            }
            {activeRallyDetails && 
                <RallyDetails
                    open={activeRallyDetails ? 1 : 0}
                    rally={activeRallyDetails}
                    handleClose={handleRallyDetailsClose}
                />
            }    

            <OrderWarningDialog
                open={Boolean(orderWarningDialog.action)}
                handleClose={() =>
                    setOrderWarningDialog({ action: null, text: "" })
                }
                handleAction={orderWarningDialog.action}
                text={orderWarningDialog.text}
            />
        </React.Fragment>
      
    )
}

const mapStateToProps = state => {
    return {
        activeOrder: state.auth.profile.activeOrder,
        activeInstanceId: state.mission.activeInstanceId,
        multipleSession: state.auth.multipleSession,
        party: state.party
    };
  };

const mapDispatchToProps = dispatch => {
    return {
        authCheck: () => dispatch(authCheck()),
        setActiveInstance: (id, imgSrc) => dispatch(setActiveInstance(id, imgSrc))
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Events)
