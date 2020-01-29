import React, {useState} from "react";
import { useHistory } from "react-router";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ChangePasswordModal from "../auth/ChangePasswordModal";
import {OrderContext} from '../App'

const Settings = props => {
  const history = useHistory();

  const { handleChangePassword, handleLogout } = React.useContext(
    OrderContext
  );

const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false)

const togglePasswordChangeModal = e => {
    setShowPasswordChangeModal(prev => !prev)
}




  return (
    <React.Fragment>
      <Button
        style={{ borderRadius: 0 }}
        variant="contained"
        fullWidth
        size="large"
        onClick={() => history.push("menu")}
      >
        {"< Wróć"}
      </Button>
      <Grid
        container
        direction="column"
        justify="space-evenly"
        align="center"
        style={{ height: "100vh" }}
      >
        <Grid item>
          <Button onClick={togglePasswordChangeModal}>Zmiana hasła</Button>
        </Grid>
        <Grid item>
          <Button onClick={handleLogout}>Wyloguj</Button>
        </Grid>
      </Grid>
      <ChangePasswordModal open={showPasswordChangeModal} handleClose={togglePasswordChangeModal} handleConfirm={handleChangePassword} handleLogout={handleLogout}/>
    </React.Fragment>
  );
};

export default Settings;
