import React from "react";
import QRCode from 'qrcode'
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const PartyJoiningDialog = props => {


  const [qrCode, setQrCode] = React.useState(null)
  var opts = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 0.9,
    margin: 1
  }
   
  React.useEffect(() => {
    QRCode.toDataURL(props.userId, opts, function (err, url) {
      if (err) throw err
      setQrCode(url)
    })
  }, [])



  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      PaperProps={{ style: { minHeight: "50vh" } }}
      fullWidth
      style={{ zIndex: 2000 }}
    >
      <DialogTitle>Szukaj drużyny</DialogTitle>

      <DialogContent>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography>
              Pokaż ten kod liderowi drużyny. On będzie wiedział, co robić!
            </Typography>
          </Grid>
          <Grid item style={{width: '100%'}}>
            <img src={qrCode}  style={{width: '100%'}}/>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Zamknij</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PartyJoiningDialog;
