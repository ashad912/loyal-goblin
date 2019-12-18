import React , {useEffect, useState} from "react";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import {setMultipleSession} from '../../store/actions/authActions'

const RootSnackbar = props => {

    const [delay, setDelay] = useState(false)
    
    useEffect(() => {
        let timer = setTimeout(() => {
            setDelay(true)
            
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // useEffect(() => {
    //     if(delay){
    //         const multipleSession = props.party && props.party.hasOwnProperty('leader') && props.party.leader && props.party.leader.hasOwnProperty('_id') && !props.socket.connected
    //         if(!multipleSession){
    //             props.setMultipleSession()
    //         }
    //     }   
    // }, [delay])
    
    const notTheLeader = (props.screen === 1) && (!props.activeInstanceId)
         && props.party.members.length && props.party.leader.hasOwnProperty('_id') && (props.party.leader._id !== props.auth.uid)
 
    const multipleSession = props.auth.multipleSession
    return (
        <React.Fragment>
            {delay && ((props.screen === 1) || (props.screen === 0)) && (
                <Snackbar
                    anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
                open={notTheLeader || multipleSession}
                //onClose={!notTheLeader || !multipleSession}
                //autoHideDuration={10000}
                message={
                    <React.Fragment>
                        {notTheLeader === true && (<p style={{margin: '0'}}>Tylko lider drużyny, może rozpocząć nową misję.</p>)}
                        {(props.screen === 1) && multipleSession === true && (<p style={{margin: '0'}}>Wielokrotna sesja. Zamknij inne karty, a następnie odśwież, aby zarządzać misjami.</p>)}
                        {(props.screen === 0) && multipleSession === true && (<p style={{margin: '0'}}>Wielokrotna sesja. Zamknij inne karty, a następnie odśwież, aby zarządzać drużyną.</p>)}
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
        auth: state.auth,
        party: state.party,
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(RootSnackbar);