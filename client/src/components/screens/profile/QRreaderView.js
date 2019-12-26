import React from "react";
import QrReader from "react-qr-reader";
import Button from "@material-ui/core/Button";
const QRreaderView = props => {


   const handleScan = value => {
        if (value && value.match(/^[0-9a-fA-F]{24}$/)) {
          props.handleAddMember(value)
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
      <div style={{position: 'absolute', width: '100%', height: '10vh', bottom:'0', left:'0', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'white'}}>
  <Button variant="contained" onClick={props.handleReturn}>{"< Wróć"}</Button>
      </div>
     
    </div>
  );
};

export default QRreaderView;
