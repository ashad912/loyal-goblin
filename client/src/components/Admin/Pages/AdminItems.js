import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import NewItemCreator from "../items/NewItemCreator";

const AdminItems = () => {
  const [showNewItemCreator, setShowNewItemCreator] = React.useState(true);

  const toggleItemCreator = e => {
    setShowNewItemCreator(prev => !prev);
  };

  return (
    <div>
      {showNewItemCreator ? (
        <NewItemCreator
          open={showNewItemCreator}
          handleClose={toggleItemCreator}
        />
      ) : (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleItemCreator}
          >
            Stwórz przedmiot
          </Button>
          <Typography>Lista przedmiotów</Typography>
        </div>
      )}
    </div>
  );
};

export default AdminItems;
