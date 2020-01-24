import React from "react";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const PageNotFound = () => {
  const history = useHistory();
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: 'column',
        textAlign: "center",
        margin: "2rem auto"
      }}
    >
      <Typography variant="h5">
        Strona o podanym adresie nie istnieje!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push("/")}
      >
        Wróć do ekranu głównego
      </Button>
    </div>
  );
};

export default PageNotFound;
