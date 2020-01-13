import React from "react";
import QrReader from "react-qr-reader";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const QRreader = props => {


   const handleScan = value => {
        if (value && value.match(/^[0-9a-fA-F]{24}$/)) {
          alert(value)
        }
      }
    const  handleError = err => {
        console.error(err)
      }

  return (
    <div style={{position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'black'}}>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
      <div style={{position: 'absolute', width: '100%', height: '10vh', top:'0', left:'0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: 'rgba(0, 0, 0, 0.2)', color: 'white'}}>
  
        <Button style={{color: 'rgb(197, 197, 197)', flexBasis: '20%'}} onClick={props.onReturn}>{"< Menu"} </Button>
        <Typography style={{flexBasis: "80%", textAlign:'center'}}>SKANOWANIE ZAMÓWIENIA</Typography>
      </div>
     
    </div>
  );
};

export default QRreader;
