import React from 'react'
import { useDispatch } from 'react-redux'
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { setFooterHeight } from 'store/actions/layoutActions';



const Footer = (props) => {

    const dispatch = useDispatch()
    const footerRef = React.useRef()

    React.useLayoutEffect(() => {
        if (footerRef.current) {
            dispatch(setFooterHeight(footerRef.current.offsetHeight))
        }
    }, []);

    return (
        <div
            style={{
                backgroundColor: 'black',
                padding: '0 1rem 0 1rem',
                display: 'flex',
                alignItems: 'center',
                height: '7vh',
                width: '100%',
                boxSizing: 'border-box',
                position: 'static',
                zIndex: '1000',
                bottom: '0',
                left: '0'
            }}
            id="footer"
            ref={footerRef}
        >
            <Container maxWidth='xs' style={{ display: 'flex', flexWrap: 'wrap', padding: 0 }}>
                <Divider />
                <Typography style={{ textAlign: 'left', color: 'white', fontSize: '0.7em', width: '100%'}} variant="body1">Potrzebujesz aplikacji? Pytaj przy barze!</Typography>
                <Typography style={{ textAlign: 'left', color: 'white', flexGrow: '6', fontSize: '0.9em' }} variant="body1">© 2019-{new Date().getFullYear()} HHG Studio</Typography>
                <Typography style={{ textAlign: 'right', color: 'white', flexGrow: '6', fontSize: '0.9em' }} variant="body1">v1.6.0-ALPHA</Typography>
            </Container>
        </div>
    )
}


export default Footer