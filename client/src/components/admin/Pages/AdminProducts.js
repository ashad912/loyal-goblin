import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import NewProductCreator from "../products/NewProductCreator";

const AdminProducts = () => {
  const [showNewProductCreator, setShowNewProductCreator] = React.useState(true);

  const toggleItemCreator = e => {
    setShowNewProductCreator(prev => !prev);
  };

  return (
    <div>
      {showNewProductCreator ? (
        <NewProductCreator
          open={showNewProductCreator}
          handleClose={toggleItemCreator}
        />
      ) : (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleItemCreator}
          >
            Nowy produkt
          </Button>
          <Typography>Lista produktów</Typography>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;