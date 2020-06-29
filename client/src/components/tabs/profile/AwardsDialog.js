import React from "react";
import PropTypes from 'prop-types'
import AwardsHeader from "../AwardsHeader";
import AwardsDialogSchema from "../AwardsDialogSchema";
import AwardsList from "../AwardsList";

const AwardsDialog = ({open, handleClose, title, notifications}) => { 
  return (
    <AwardsDialogSchema 
      open={open}
      handleClose={handleClose}
      title={title}
      biggerHeader={notifications.experience <= 0}
      header={
        <AwardsHeader 
            experience={notifications.experience}
            awards={notifications.awards}
            expTitle='Zdobyte doświadczenie:'
            awardsTitle='Zdobyte przedmioty:'
          />
      }
      list={
        <AwardsList 
            awards={notifications.awards}
            style={{
              width: "100%"
            }}
          /> 
      }
    />
  );
};

AwardsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  notifications: PropTypes.shape({
    isNew: PropTypes.bool.isRequired,
    experience: PropTypes.number.isRequired,
    awards: PropTypes.array.isRequired
  })
}

export default AwardsDialog;
