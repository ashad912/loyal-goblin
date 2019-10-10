import React from 'react'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { Badge } from '@material-ui/core';
import tempUserAvatar from '../../assets/avatar/moose.png'
import { connect } from 'react-redux';
import { textAlign } from '@material-ui/system';

const StyledAppBar = styled(AppBar)`
    
    
`


const Navbar = (props) => {

    const createAvatarPlaceholder = (name) => {

        if (!(/\s/.test(name))) {
            return name.charAt(0).toUpperCase()
        }
        
        const initials = name.split(" ").map(word => {
            return word.charAt(0)
        }).join('').toUpperCase()

        return initials
    }

    const avatar = true
    console.log(props.auth)

    return(
        <StyledAppBar  position="static">
            <Toolbar>
        {props.auth.uid ? (
            <React.Fragment>
                <Badge
                    style={{height: 30, width: 30, marginRight: '0.5rem'}}
                    overlap="circle"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                >
                    {avatar ? <Avatar style={{height: 30, width:30}} alt="avatar" src={tempUserAvatar} /> : <Avatar style={{height: 30, width: 30}}>{createAvatarPlaceholder(props.auth.profile.name)}</Avatar>}
                </Badge>
                <Typography variant="h6" style={{flexGrow: 1, textAlign: 'left'}}>
                    {props.auth.profile.name}
                </Typography>
                <Button color="inherit">Statistics</Button>
                <Button color="inherit">Logout</Button>
            </React.Fragment>
        ) : (
            <React.Fragment>
                <Typography variant="h6" style={{flexGrow: 1, textAlign: 'left'}}>
                        LoyalGoblin
                </Typography>
                <Button color="inherit">Login</Button>
            </React.Fragment>
        )}
        </Toolbar>
        </StyledAppBar>
       
    )
}




const mapStateToProps = (state) => {
    return {
        auth: state.auth,
    }
}



export default connect(mapStateToProps)(Navbar)