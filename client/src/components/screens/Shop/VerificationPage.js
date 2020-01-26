import React from "react";
import { useHistory } from "react-router-dom";
import {connect} from 'react-redux'
import axios from 'axios'
import moment from 'moment'
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
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { cancelOrder, leaveShop } from "../../../store/actions/shopActions";
import {itemsPath, usersPath} from '../../../utils/definitions'
import {createAvatarPlaceholder} from '../../../utils/methods'

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

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
  const [timer, setTimer] = React.useState('')
  const [orderFinalized, setOrderFinalized] = React.useState(false)
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
    calculateTimeLeft()
    const orderTimeout = setInterval(() => {
      calculateTimeLeft()
    }, 1000);
    const checkOrderFinalized = setInterval(() => {
      checkActiveOrder()
    }, 5000);
    return () => {
      clearInterval(orderTimeout)
      clearInterval(checkOrderFinalized)
    }
  }, [])

  const checkActiveOrder = async () => {
    const res = await axiosInstance.get('/product/activeOrder')
    if(!res.data){
      setOrderFinalized(true)
      setTimeout(async() => {
        await props.onLeaveShop()
        history.push("/");
      }, 5000);
    }
  }


  const calculateTimeLeft = () => {
    if(!orderFinalized){

      const utcDateNow = moment.utc(new Date())
      const orderTimeMax = moment(props.activeOrder[0].createdAt)
      const difference = orderTimeMax.diff(utcDateNow)
      if(difference > 0 && difference < 2001){
        checkActiveOrder()
      }
      else if(difference > 0 ){
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const formatted = moment(`${minutes}:${seconds}`, "mm:ss").format('mm:ss')
        setTimer(`Zamówienie wygaśnie za ${formatted}`)
      }else{
  
          handleCancelOrder()
  
      }
    }
  }


const handleCloseCancelDialog = () => {
  setShowCancelDialog(prev => !prev)
}

const handleCancelOrder = async () => {
  await props.onCancelOrder()
  await props.onLeaveShop()
  history.push("/");
}


  return (
    <Container maxWidth="sm" style={{padding: '1rem 0.4rem'}}>
      <Paper style={{ width: "100%", paddingTop: '1rem' }}>
       {orderFinalized ? <Typography variant="h5" style={{width: '100%', marginBottom: '0.5rem'}} color="primary">Zamówienie zostało zatwierdzone!</Typography> :  <Typography variant="h5" style={{marginBottom: '1rem'}}>Pokaż ten kod przy barze, by otrzymać nagrody!</Typography>}
        {orderFinalized ? <CheckCircleOutlineIcon color="primary" style={{fontSize: '50vw'}}/> : 
        <img src={qrCode} style={{width: '80%', marginBottom: '1rem'}}/>
        }
 {!orderFinalized ?  <Typography variant="h6" style={{width: '100%', marginBottom: '1rem'}} color="secondary">{timer}</Typography>:
 <div style={{marginBottom: '2rem'}}>
<Typography  variant="caption">Za chwilę nastąpi przekierowanie do profilu...</Typography>
 </div>
}
 
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
                          {basket.profile.avatar ? <img src={usersPath + basket.profile.avatar} style={{width: '3rem'}}/> : 
                          <Avatar style={{width: '3rem', height: '3rem'}}>{createAvatarPlaceholder(basket.profile.name)}</Avatar>}
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
                                src={itemsPath + award.itemModel.imgSrc}
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
      {!orderFinalized && <Button style={{marginTop: '1rem'}} color="secondary" onClick={handleCloseCancelDialog}>Anuluj zamówienie</Button>}
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
    party: [state.party.leader, ...state.party.members]
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCancelOrder: () => dispatch(cancelOrder()),
    onLeaveShop: () => dispatch(leaveShop())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerificationPage);
