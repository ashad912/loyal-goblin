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
import { Link } from '@material-ui/core';
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
        <StyledAppBar  position="static" id="navbar">
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
                <Typography>
                    <Link href='/signin' to='/signin' underline='none' style={{color: 'white'}}>
                        Wyloguj  
                    </Link>
                </Typography>
            </React.Fragment>
        ) : (
            <React.Fragment>
                <Typography variant="h6" style={{flexGrow: 1, textAlign: 'left'}} >
                    <Link href='/' to='/' underline='none' style={{color: 'white'}}>
                        Loyal Goblin
                    </Link>
                </Typography>
                <Typography>
                    <Link href='/signin' to='/signin'  nderline='none' style={{color: 'white', marginRight: '1rem'}}>
                        Zaloguj
                    </Link>
                </Typography>
                <Typography>
                    <Link href='/signup' to='/signup' underline='none' style={{color: 'white'}}>
                        Dołącz
                    </Link>
                </Typography>
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