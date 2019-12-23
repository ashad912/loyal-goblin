import React from "react";
import { useHistory } from "react-router-dom";
import {connect} from 'react-redux'
import QRCode from 'qrcode'
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { cancelOrder, leaveShop } from "../../../store/actions/shopActions";


//Info z backendu
const baskets = [
  {
    user: {
      id: 1,
      name: "Ancymon Bobrzyn"
    },
    price: 26.0,
    experience: 2600,
    amulets: [
      {
        itemModel: {
          id: 101,
          type: {
            id: 201,
            type: "amulet"
          },
          name: "Diament",
          imgSrc: "diamond-amulet.png"
        }
      }
    ]
  },
  {
    user: {
      id: 2,
      name: "Cecylia Dedoles"
    },
    price: 7.0,
    experience: 700,
    amulets: []
  },
  {
    user: {
      id: 3,
      name: "Ewelina"
    },
    price: 13.0,
    experience: 1300,
    amulets: [
      {
        itemModel: {
          id: 101,
          type: {
            id: 201,
            type: "amulet"
          },
          name: "Perła",
          imgSrc: "pearl-amulet.png"
        }
      }
    ]
  }
];

const VerificationPage = props => {
  const history = useHistory();
  const [showCancelDialog, setShowCancelDialog] = React.useState(false)
  const [qrCode, setQrCode] = React.useState(null)
  var opts = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 0.9,
    margin: 1
  }

  React.useEffect(() => {
    QRCode.toDataURL(props.user.uid, opts, function (err, url) {
      if (err) throw err
      setQrCode(url)
    })
  }, [])

  const createAvatarPlaceholder = (name) => {

    if (!(/\s/.test(name))) {
        return name.charAt(0).toUpperCase()
    }
    
    const initials = name.split(" ").map(word => {
        return word.charAt(0)
    }).join('').toUpperCase()

    return initials
}

const handleCloseCancelDialog = () => {
  setShowCancelDialog(prev => !prev)
}

const handleCancelOrder = async () => {
  history.push("/");
  await props.onCancelOrder()
  await props.onLeaveShop()
}


  return (
    <Container maxWidth="sm" style={{padding: '1rem 0.4rem'}}>
      <Paper style={{ width: "100%", paddingTop: '1rem' }}>
        <Typography variant="h5" style={{marginBottom: '1rem'}}>Pokaż ten kod przy barze, by otrzymać nagrody!</Typography>
        <img src={qrCode} style={{width: '80%', marginBottom: '1rem'}}/>
        <Divider />
        <List component="nav" style={{ width: "100%" }}>
          {props.activeOrder && props.activeOrder.map(basket => {
            if(basket.price || basket.experience){

              return (
                <React.Fragment key={basket.profile._id}>
                  <ListItem style={{ flexDirection: "column"}}>
                    <List style={{ width: "100%" }}>
                      <ListItem>
                        <ListItemAvatar>
                          {basket.profile.avatar ? <img src={'/images/user_uploads/'+basket.profile.avatar} width={32}/> : 
                          <Avatar style={{height: 30, width: 30}}>{createAvatarPlaceholder(basket.profile.name)}</Avatar>}
                        </ListItemAvatar>
                        <ListItemText primary={basket.profile.name} />
                        <ListItemText
                          secondary={basket.price.toFixed(2) + " ZŁ"}
                        />
                      </ListItem>
                    </List>
                    <List style={{ paddingLeft: "2rem" }}>
                      <ListItem>
                        <ListItemText
                          primary={"Doświadczenie: " + basket.experience + " punktów"}
                        />
                      </ListItem>
                      {basket.awards.map(award => {
                        return (
                          <ListItem key={award._id}>
                            <ListItemIcon>
                              <img
                                src={"/images/items/" +award.itemModel.imgSrc}
                                width="32"
                              />
                            </ListItemIcon>
                            <ListItemText primary={award.itemModel.name} secondary={award.quantity > 1 && `x${award.quantity}`}/>
                          </ListItem>
                        );
                      })}
                    </List>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            }
          })}
        </List>
      </Paper>
      <Button style={{marginTop: '1rem'}} color="secondary" onClick={handleCloseCancelDialog}>Anuluj zamówienie</Button>
      <Dialog
        open={showCancelDialog}
        onClose={handleCloseCancelDialog}
      >
        <DialogTitle id="alert-dialog-title">Anulować zamówienie?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Anulowane zamówienie zostanie utracone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} >
            Wróć
          </Button>
          <Button onClick={handleCancelOrder} color="secondary" variant="contained">
            Zatwierdź
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    activeOrder: state.auth.profile.activeOrder,
    party: state.party.members.unshift(state.party.leader)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCancelOrder: () => dispatch(cancelOrder()),
    onLeaveShop: () => dispatch(leaveShop())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerificationPage);
