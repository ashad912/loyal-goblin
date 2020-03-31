import React, {useRef} from "react";
import QrReader from "react-qr-reader";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";


const QRreaderView = props => {

  const qrRef = useRef(null) 
  const [cameraDenied, setCameraDenied] = React.useState(false)
  const [isIOS, setIsIOS] = React.useState(false)

  React.useEffect(() => {
    navigator.permissions.query({name: 'camera'})
      .then((permissionObj) => {
        if(permissionObj.state === 'denied'){
          setCameraDenied(true)
        }
      })
      .catch((error) => {
        //console.log('Got error :', error);
      })
      var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
      if(iOS){
        setIsIOS(true)
      }
  }, [])

   const handleScan = value => {
        if (value && value.match(/^[0-9a-fA-F]{24}$/)) {
          props.handleAddMember(value)
        }
      }
    const  handleError = err => {
        console.error(err)
      }

      const openImageDialog = () => {
        if(qrRef && qrRef.current){
          qrRef.current.openImageDialog()
        }
      }

  return (
    <div style={{position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'black'}}>
      {cameraDenied ? 
    <Paper style={{margin: '0 2rem', padding: '2rem', overflowY: 'scroll'}}>
      <Typography color="secondary" style={{textAlign: 'center'}}>Przy pierwszym uruchomieniu, dostęp do kamery został zablokowany przez użytkownika.</Typography>
      <Typography>By skanować kody QR innych osób, musisz zezwolić aplikacji na dostęp do kamery urządzenia. Możesz to zrobić otwierając stronę internetową aplikacji w przeglądarce i ręcznie zmieniając ustawienia zezwoleń (zazwyczaj naciskając na przycisk na początku adresu URL strony).</Typography>
    </Paper>  
    :
    
      <QrReader
      ref={qrRef}
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
        legacyMode={isIOS}
      />
    }
      <div style={{position: 'absolute', width: '100%', height: isIOS ? '20vh' : '10vh', bottom:'0', left:'0', display: 'flex', flexDirection: 'column', justifyContent: isIOS ? 'space-around' : 'center', alignItems: 'center', background: 'white'}}>
     {isIOS &&  <Button variant="contained" onClick={openImageDialog}>{"Zeskanuj kod QR"}</Button>}
  <Button variant="contained" onClick={props.handleReturn}>{"< Wróć"}</Button>
      </div>
     
    </div>
  );
};

export default QRreaderView;
