import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import NewEventCreator from "../components/NewEventCreator";

const AdminMissions = () => {
  const [showNewEventCreator, setShowNewEventCreator] = React.useState(true);

  const toggleEventCreator = e => {
    setShowNewEventCreator(prev => !prev);
  };

  return (
    <div>
      {showNewEventCreator ? (
        <NewEventCreator
          open={showNewEventCreator}
          handleClose={toggleEventCreator}
        />
      ) : (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleEventCreator}
          >
            Stwórz nowe wydarzenie
          </Button>
          <Typography>Lista wydarzeń</Typography>
        </div>
      )}
    </div>
  );
};

export default AdminMissions;
