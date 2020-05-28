import React from "react";
import { useHistory } from "react-router-dom";
import {connect} from 'react-redux'
import axios from 'axios'
import moment from 'moment'
import QRCode from 'qrcode'
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { PintoSerifTypography, PintoTypography } from "../../utils/fonts";
import { cancelOrder, leaveShop } from "../../store/actions/shopActions";
import {itemsPath, usersPath, palette} from '../../utils/definitions'
import {createAvatarPlaceholder} from '../../utils/methods'
import AwardListItem from "components/AwardListItem";
import AvatarWithPlaceholder from "components/AvatarWithPlaceholder";


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

const ShopVerification = props => {
  const history = useHistory();
  const [showCancelDialog, setShowCancelDialog] = React.useState(false)
  const [timer, setTimer] = React.useState('')
  const [orderFinalized, setOrderFinalized] = React.useState(false)
  
  const [qrCode, setQrCode] = React.useState(null)
  const leaveShopTimeout = React.useRef(false)

  var opts = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 0.9,
    margin: 1
  }

  React.useEffect(() => {
    window.scrollTo(0, 0)
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
      clearTimeout(leaveShopTimeout.current)
    }
  }, [])

  const checkActiveOrder = async () => {
    
      const res = await axiosInstance.get('/product/activeOrder')
      if(!res.data){
        setOrderFinalized(true)
        
        leaveShopTimeout.current = setTimeout(async() => {
            await props.onLeaveShop()
            history.push("/", {authCheck: true});
        }, 3000);
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
  const res = await axiosInstance.get('/product/activeOrder')
  if(res.data){
    await props.onCancelOrder()
  }
  await props.onLeaveShop()
  history.push("/");
}


  return (
    <Container maxWidth="sm" style={{padding: '1rem 0.4rem'}}>
      <div style={{ width: "100%", paddingTop: '1rem' }}>
      {orderFinalized ? 
        <Typography variant="h5" style={{width: '100%', marginBottom: '0.5rem'}} color="primary">Zamówienie zostało zatwierdzone!</Typography> 
      :  
        <Typography variant="h5" style={{marginBottom: '1rem'}}>Pokaż ten kod przy barze, by otrzymać nagrody!</Typography>
      }
        {orderFinalized ? 
        <CheckCircleOutlineIcon color="primary" style={{fontSize: '50vw'}}/> 
        : 
        <img src={qrCode} style={{width: '80%', marginBottom: '1rem'}}/>
      }
      {!orderFinalized ?  <Typography variant="h6" style={{width: '100%', marginBottom: '1rem'}} color="secondary">{timer}</Typography>:
        <div style={{marginBottom: '2rem'}}>
        <Typography  variant="caption">Za chwilę nastąpi przekierowanie do profilu...</Typography>
        </div>
      }
 
        
        <List component="nav" style={{ width: "100%" }}>
          {props.activeOrder && props.activeOrder.map(basket => {
            if(basket.products.length > 0){

              return (
                <React.Fragment key={basket.profile._id}>
                  <ListItem style={{ flexDirection: "column"}}>
                    <List style={{ width: "100%" }}>
                  <ListItem style={{alignItems:'flex-start', padding:0}}>
                      <Grid container>
                        <Grid container style={{padding: '0 24px'}}>
                          <Grid item xs={4}>
                          <AvatarWithPlaceholder 
                            avatar={basket.profile.avatar}
                            width="5rem"
                            height="5rem"
                            placeholder={{
                                text: basket.profile.name,
                                fontSize: '2.2rem'
                            }}
                          />
                           
                          </Grid>
                          <Grid item xs={8} container direction="column" alignItems="flex-start" style={{paddingLeft: '10%'}}>
                            <Grid item>
                              <Typography variant="h5" style={{marginBottom: '0.5rem'}}>{basket.profile.name}</Typography>
                            </Grid>
                            <Grid item>
                              <Typography style={{color: palette.background.darkGrey}}>{basket.price.toFixed(2) + " ZŁ"}</Typography>
                              <Typography  style={{color: palette.primary.main}}>{basket.experience + " PD"}</Typography>
                            </Grid>
                          </Grid>
                        </Grid>  
                        <Grid item xs={12}>
                            <List dense style={{paddingTop: '1rem', paddingBottom: '1rem'}}>

                              {basket.awards.map(award => {
                                return (
                                  <AwardListItem 
                                    key={award.itemModel._id} 
                                    item={award} 
                                    perksDisable 
                                    alternativeFont 
                                    disableUpDownPadding
                                    smallAvatar
                                  />
                                );
                              })}
                            </List>
                        </Grid>
                      </Grid>
                    </ListItem>
              
                      
                    </List>
                  </ListItem>
                  
                </React.Fragment>
              );
            }
          })}
        </List>
      </div>
      {!orderFinalized && <Button style={{marginTop: '1rem'}} color="secondary" onClick={handleCloseCancelDialog}>Anuluj zamówienie</Button>}
      <Dialog
        open={showCancelDialog}
        onClose={handleCloseCancelDialog}
      >
        <DialogTitle id="alert-dialog-title">Anulować zamówienie?</DialogTitle>
        <DialogContent>
          <PintoTypography style={{color: palette.background.darkGrey}}>
            Anulowane zamówienie zostanie utracone.
          </PintoTypography>
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopVerification);
