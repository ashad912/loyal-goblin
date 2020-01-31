import React from 'react'
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import {palette} from '../../utils/definitions'

const Footer = (props) => {
    return(
        <div style={{backgroundColor: 'black', paddingLeft: '1rem'}} id="footer">
            <Divider/>
            <Typography style={{textAlign: 'left', color: 'white'}} variant="body1">© 2019-2020 HHG Studio</Typography>
        </div>
    )
}


export default Footer