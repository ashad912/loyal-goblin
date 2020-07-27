import React from "react";
import moment from 'moment'
import {connect} from 'react-redux'

import OperationDialog from "components/OperationDialog";

import {resetCheckWarning} from 'store/actions/communicationActions'
import refStore from 'store/enhancers/refEnhancer'
import { warningActionSources } from "utils/constants";



const WarningDialog = (props) => {

  const [warning, setWarning] = React.useState('')

  React.useEffect(() => {
   if(props.warning.text){
      handleWarning(refStore.resolveWarning, props.warning.actionType)
   }
  }, [props.warning.text])

  const handleWarning = (action, actionType) => {
    
    const warningsTypes = {
        mission: () => {
            if(props.activeMissionId){
                return warningActionSources.mission
            }
            return ''
        }, 
        order: () => {
            if((props.activeOrder.length && isValidOrder(props.activeOrder))
            || (props.leader && props.leader.activeOrder.length && isValidOrder(props.leader.activeOrder))){
                return warningActionSources.order
            }
            return ''
        }
    }

    const isValidOrder = (order) => {
        return moment.utc().valueOf() < moment.utc(order[0].createdAt).add("5", "minutes").valueOf()
    }


    let warning = ''

    for(const warningType in warningsTypes){
        //no warning if triggered the same action type
        if(warningType === actionType){
            continue
        }

        warning = warningsTypes[warningType]()

        if(warning){
            setWarning(warning)
            break;
        }
    }

    if(!warning){
        action()
        props.resetCheckWarning()
    }        
  } 


  const handleModalAction = () => {
    setWarning('')
    refStore.resolveWarning()
    props.resetCheckWarning()
  }

  const handleClose = () => {
    setWarning('')
    props.resetCheckWarning()
  }

  const endTexts = {
    [warningActionSources.mission]: 'spowoduje opuszczenie misji, w której obecnie bierzesz udział.',
    [warningActionSources.order]: 'spowoduje usunięcie aktywnego zamówienia.'
  }

  return (
    <OperationDialog 
      open={Boolean(warning)}
      onClose={handleClose}
      handleAction={handleModalAction}
      title="Potwierdź wykonanie akcji"
      desc={`${props.warning.text} ${endTexts[warning]}`}
      cancelText="Anuluj"
      confirmText="Potwierdź"
      maxWidth="xs"
    />
  );
};

const mapDispatchToProps = dispatch => {
  return {
    resetCheckWarning: () => { dispatch(resetCheckWarning())}
  };
};

const mapStateToProps = state => {
  return {
      activeOrder: state.auth.profile.activeOrder,
      leader: state.party.leader,
      activeMissionId: state.mission.activeInstanceId,
      warning: state.communication.warning,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WarningDialog);
