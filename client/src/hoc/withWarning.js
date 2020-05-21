import React from 'react'
import moment from 'moment'
import { compose } from "redux";
import { connect } from "react-redux";
import {setWarning} from 'store/actions/communicationActions'



const withWarning = (WrappedComponent) => {
    return class extends React.Component {

        isValidOrder = (order) => {
            return moment.utc().valueOf() < moment.utc(order[0].createdAt).add("5", "minutes").valueOf()
        }

        handleWarning = (action, text) => {
            let type = ''
            if(this.props.activeMissionId){
              type = 'mission'
            }else if(
                (this.props.activeOrder.length && this.isValidOrder(this.props.activeOrder))
                || (this.props.leader && this.props.leader.activeOrder.length && this.isValidOrder(this.props.leader.activeOrder))
                ){
              type = 'order'
            }
        
            if(type){
              this.props.setWarning(action, text, type)
            }else{
              action()
            }   
        }

        render(){
            return(
                <WrappedComponent
                    handleWarning={this.handleWarning}
                    {...this.props}
                />   
            )
        }
    }
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
  
  
export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withWarning
);
