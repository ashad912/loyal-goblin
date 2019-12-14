import React from "react";
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
                          {basket.profile.avatar && <img src={'/images/user_uploads/'+basket.profile.avatar} width={32}/>}
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
                          <ListItem>
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

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerificationPage);
