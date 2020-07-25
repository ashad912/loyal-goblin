import React from 'react'
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

const Footer = (props) => {
    return (
        <div
            style={{
                backgroundColor: 'black',
                padding: '0 1rem 0 1rem',
                display: 'flex',
                alignItems: 'center',
                height: '5vh',
                width: '100%',
                boxSizing: 'border-box',
                position: 'static',
                zIndex: '1000',
                bottom: '0',
                left: '0'
            }}
            id="footer"
        >
            <Container maxWidth='xs' style={{ display: 'flex', padding: 0 }}>
                <Divider />
                <Typography style={{ textAlign: 'left', color: 'white', flexGrow: '6' }} variant="body1">© 2019-{new Date().getFullYear()} HHG Studio</Typography>
                <Typography style={{ textAlign: 'right', color: 'white', flexGrow: '6' }} variant="body1">v1.5.4-ALPHA</Typography>
            </Container>
        </div>
    )
}


export default Footer