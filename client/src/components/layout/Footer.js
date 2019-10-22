import React from 'react'
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const Footer = (props) => {
    return(
        <div style={{backgroundColor: '#3f51b5', paddingLeft: '1rem'}} id="footer">
            <Divider/>
            <Typography style={{textAlign: 'left', color: 'white'}} variant="body1">© 2019 HHG Studio</Typography>
        </div>
    )
}


export default Footer