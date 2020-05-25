// import React from 'react'
// import moment from 'moment'
// import { connect } from "react-redux";

// import {setWarning} from 'store/actions/communicationActions'
// import { warningActionSources } from 'utils/definitions';


// const withWarning = (props) => {
    
//         const WrappedComponent = props.component

        
//         const handleWarning = (action, text, actionType) => {

//             const warningActionTypes = {
//                 mission: () => {
//                     if(props.activeMissionId){
//                         return warningActionSources.mission
//                     }
//                     return ''
//                 }, 
//                 order: () => {
//                     if((props.activeOrder.length && isValidOrder(props.activeOrder))
//                     || (props.leader && props.leader.activeOrder.length && isValidOrder(props.leader.activeOrder))){
//                         return warningActionSources.order
//                     }
//                     return ''
//                 }
//             }

//             const isValidOrder = (order) => {
//                 return moment.utc().valueOf() < moment.utc(order[0].createdAt).add("5", "minutes").valueOf()
//             }


//             let type = ''

//             for(const warningType in warningActionTypes){
//                 //no warning if triggered the same action type
//                 if(warningType === actionType){
//                     continue
//                 }

//                 type = warningActionTypes[warningType]()

//                 if(type){
//                     props.setWarning(action, text, type)
//                     break;
//                 }
//             }

//             if(!type){
//                 action()
//             }        
//         }

//         return(
//             <WrappedComponent
//                 handleWarning={handleWarning}
//                 fullHeight={props.fullHeight}          
//             />   
//         )
        
    
// }

// const mapStateToProps = state => {
//     return {
//       activeOrder: state.auth.profile.activeOrder,
//       leader: state.party.leader,
//       activeMissionId: state.mission.activeInstanceId
//     };
// };

// const mapDispatchToProps = dispatch => {
//     return{
//         setWarning: (action, text, type) => dispatch(setWarning(action, text, type))
//     }
    
// }
  
  
// export default connect(mapStateToProps, mapDispatchToProps)(withWarning)
    

