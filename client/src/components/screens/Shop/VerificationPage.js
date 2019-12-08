import React from "react";
import QRCode from 'qrcode'
import uuid from 'uuid/v1'
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
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
      <Paper style={{ width: "100%" }}>
        <Typography>Pokaż ten kod przy barze, by otrzymać nagrody!</Typography>
        <img src={qrCode} style={{width: '100%'}}/>
        <Divider />
        <List component="nav" style={{ width: "100%" }}>
          {baskets.map(basket => {
            return (
              <React.Fragment key={basket.user.id}>
                <ListItem style={{ flexDirection: "column"}}>
                  <List style={{ width: "100%" }}>
                    <ListItem>
                      <ListItemText primary={basket.user.name} />
                      <ListItemText
                        secondary={basket.price.toFixed(2) + " ZŁ"}
                      />
                    </ListItem>
                  </List>
                  <List style={{ paddingLeft: "2rem" }}>
                    <ListItem>
                      <ListItemText
                        primary={"Doświadczenie: " + basket.experience}
                      />
                    </ListItem>
                    {basket.amulets.map(amulet => {
                      return (
                        <ListItem>
                          <ListItemText primary={amulet.itemModel.name} />
                          <ListItemIcon>
                            <img
                              src={require("../../../assets/icons/items/" +
                                amulet.itemModel.imgSrc)}
                              width="32"
                            />
                          </ListItemIcon>
                        </ListItem>
                      );
                    })}
                  </List>
                </ListItem>
                <Divider />
              </React.Fragment>
            );
          })}
        </List>
      </Paper>
    </Container>
  );
};

export default VerificationPage;
