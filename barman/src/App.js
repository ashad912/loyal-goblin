import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import QRReader from './components/QRReader';

function App() {
  const [screen, setScreen] = React.useState('scan')

  const handleChangeScreen = (name) => {
    setScreen(name)
  }




  switch (screen) {
    case 'menu':
      return (
        <Grid style={{height: '100vh', width: '100%'}} container direction="column" alignItems="center" justify="space-around">
          <Grid item>
            <Button variant="contained" fullWidth size="large" onClick={()=>handleChangeScreen('scan')}>Skanuj kod</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" fullWidth size="large">Otwórz ostatnie zamówienie</Button>
          </Grid>
        </Grid>

      )

    case 'scan': 
    return <QRReader onReturn={() => handleChangeScreen('menu')}/>

    case 'order':
      return null
  
    default:
      break;
  }


}

export default App;
