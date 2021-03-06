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
  
   
  React.useEffect(() => {
    const opts = {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      quality: 0.9,
      margin: 1
    }

    QRCode.toDataURL(props.userId, opts, function (err, url) {
      if (err) throw err
      setQrCode(url)
    })
  }, [])

  const handleCloseAndTriggerSocket = () => {
    props.forcePartyUpdate()
    props.handleClose()
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      PaperProps={{ style: { minHeight: "50vh" } }}
      fullWidth
      maxWidth='xs'
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
          <Grid item style={{width: '100%', textAlign: 'center'}}>
            <img src={qrCode} style={{width: '100%', maxWidth: '220px'}}/>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseAndTriggerSocket}><Typography>Zamknij</Typography></Button>
      </DialogActions>
    </Dialog>
  );
};


export default PartyJoiningDialog
