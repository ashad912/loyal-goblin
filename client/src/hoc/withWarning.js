import React from 'react'
import moment from 'moment'
import { connect } from "react-redux";

import {setWarning} from 'store/actions/communicationActions'



const withWarning = (props) => {
    
        const WrappedComponent = props.component

        const isValidOrder = (order) => {
            return moment.utc().valueOf() < moment.utc(order[0].createdAt).add("5", "minutes").valueOf()
        }

        const handleWarning = (action, text) => {
            let type = ''
            if(props.activeMissionId){
              type = 'mission'
            }else if(
                (props.activeOrder.length && isValidOrder(props.activeOrder))
                || (props.leader && props.leader.activeOrder.length && isValidOrder(props.leader.activeOrder))
                ){
              type = 'order'
            }
        
            if(type){
                props.setWarning(action, text, type)
            }else{
                action()
            }   
        }

        return(
            <WrappedComponent
                handleWarning={handleWarning}
                fullHeight={props.fullHeight}          
            />   
        )
        
    
}

const mapStateToProps = state => {
    return {
      activeOrder: state.auth.profile.activeOrder,
      leader: state.party.leader,
      activeMissionId: state.mission.activeInstanceId
    };
};

const mapDispatchToProps = dispatch => {
    return{
        setWarning: (action, text, type) => dispatch(setWarning(action, text, type))
    }
    
}
  
  
export default connect(mapStateToProps, mapDispatchToProps)(withWarning)
    

