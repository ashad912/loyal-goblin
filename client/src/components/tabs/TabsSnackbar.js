import React , {useEffect, useState} from "react";
import { connect } from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";

import {setMultipleSession} from 'store/actions/authActions'

const TabsSnackbar = props => {

    const [delay, setDelay] = useState(false)
    
    useEffect(() => {
        let timer = setTimeout(() => {
            setDelay(true)
            
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    const profile = props.profile
    const conditions = !props.hide && delay && ((props.screen === 2) || (props.screen === 0))
                        && !profile.rallyNotifications.isNew 
                        && !profile.shopNotifications.isNew
                        && !profile.levelNotifications 
    
    
    const notTheLeader = 
         props.party.members.length && props.party.leader.hasOwnProperty('_id') && (props.party.leader._id !== props.auth.uid)
 
    const multipleSession = props.auth.multipleSession
    return (
        <React.Fragment>
            {conditions && (
                <Snackbar
                    anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
                open={(notTheLeader === true && (!props.activeInstanceId) && (props.screen === 2))
                    || (notTheLeader === true && (props.screen === 0)) || multipleSession}
                message={
                    <React.Fragment>
                        {notTheLeader === true && (!props.activeInstanceId) && (props.screen === 2)
                         && (<p style={{margin: '0'}}>Tylko lider drużyny, może rozpocząć misję.</p>)}
                        {notTheLeader === true && (props.screen === 0) && (!props.party.inShop)
                         && (<p style={{margin: '0'}}>Tylko lider drużyny, może rozpocząć przygodę.</p>)}
                         {notTheLeader === true && (props.screen === 0) && (props.party.inShop)
                         && (<p style={{margin: '0'}}>Lider rozpoczął przygodę.</p>)}
                        {(props.screen === 2) && multipleSession === true
                         && (<p style={{margin: '0'}}>Wielokrotna sesja. Zamknij inne karty, a następnie odśwież, aby zarządzać misjami.</p>)}
                        {(props.screen === 0) && multipleSession === true &&
                         (<p style={{margin: '0'}}>Wielokrotna sesja. Zamknij inne karty, a następnie odśwież, aby zarządzać drużyną.</p>)}
                    </React.Fragment>
                }
            />
            )}
        </React.Fragment>
        
    );
};

const mapDispatchToProps = dispatch => {
    return {
      setMultipleSession: () => { dispatch(setMultipleSession())}
    };
  };

const mapStateToProps = state => {
    return {
        activeInstanceId: state.mission.activeInstanceId,
        auth: state.auth,
        profile: state.auth.profile,
        party: state.party,
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(TabsSnackbar);