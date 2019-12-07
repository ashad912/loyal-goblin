import React from "react";
import QrReader from "react-qr-reader";
const QRreaderView = props => {
    const [data, setData] = React.useState('')

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
      <p>{data}</p>
    </div>
  );
};

export default QRreaderView;
