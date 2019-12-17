import React from "react";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import {socket } from '../../../socket'

const MissionSnackbar = props => {
    const notTheLeader = (props.screen === 1) && (!props.activeInstanceId) && props.party.members.length && props.party.leader.hasOwnProperty('_id') && (props.party.leader._id !== props.auth.uid)
    const multipleSession = (props.screen === 1) && props.party.leader.hasOwnProperty('_id') && (socket.connected === false)
    return (
        <React.Fragment>
            {!props.connection.loading && (
                <Snackbar
                anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
                }}
                open={notTheLeader || multipleSession}
                onClose={!notTheLeader || !multipleSession}
                autoHideDuration={10000}
                message={
                    <React.Fragment>
                        {notTheLeader && (<span>Tylko lider drużyny, może rozpocząć nową misję.</span>)}
                        {multipleSession && (<span>Wielokrotna sesja. Zamknij inne karty, a następnie odśwież, aby dołączyć do misji.</span>)}
                    </React.Fragment>
                }
            />
            )}
        </React.Fragment>
        
    );
};


const mapStateToProps = state => {
    return {
        auth: state.auth,
        party: state.party,
        connection: state.connection
    };
  };

export default connect(mapStateToProps)(MissionSnackbar);