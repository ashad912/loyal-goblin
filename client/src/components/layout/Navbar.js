import React from 'react'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Input from '@material-ui/core/Input';
import Menu from "@material-ui/core/Menu";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from '@material-ui/core/Snackbar';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import MenuIcon from "@material-ui/icons/Menu";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import LockIcon from '@material-ui/icons/Lock';
import { Badge } from '@material-ui/core';
import { connect } from 'react-redux';
import { Link } from '@material-ui/core';
import {updateAvatar} from '../../store/actions/profileActions'
import {signOut} from '../../store/actions/authActions'
import ChangePasswordModal from '../auth/ChangePasswordModal';
import { usersPath } from '../../utils/definitions';


const StyledMenu = styled(Menu)`
    border: "1px solid #d3d4d5";
`
  
const StyledMenuItem = styled(MenuItem)`

`
  
const StyledAppBar = styled(AppBar)`
    display: ${props=>props.hide && 'none'};
    
`

const FileInputWrapper = styled.div`
  position: relative;
  background: red;
`;

const HiddenFileInput = styled(Input)`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  height: 100%;
  width: 100%;
  user-select: none;
`;

const FileInputButton = styled(Typography)`
  
`;


const Navbar = (props) => {



    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showPasswordChangeModal, setShowPasswordChangeModal] = React.useState(false)
    const [hideNavbar, setHideNavbar] = React.useState(false)
    const [showAlertSnackbar, setShowAlertSnackbar] = React.useState(false)

    React.useEffect(()=>{
        if(!props.auth.uid){
            setHideNavbar(true)
        }else{
            setHideNavbar(false)
        }
    }, [props.auth.uid])

    const handleClick = event => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = event => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const handleAvatarChange = async e => {
        if (e.target.files.length > 0) {
            const avatar = e.target.files[0]
            const avatarSize = avatar.size / 1024 / 1024; // in MB

            
            if(avatarSize < 6){
                const formData = new FormData()
                formData.append("avatar", avatar)
                e.stopPropagation();
                setAnchorEl(null);
                //window.location.reload();
                await props.updateAvatar(formData)


            }else{
                setShowAlertSnackbar(true)
            }
            
            
        }
    };

    const handleAvatarDelete = async e => {
        e.stopPropagation();
        setAnchorEl(null);
        //window.location.reload(); 
        await props.updateAvatar();
        
        
        
    };

    const handleLogout = async e => {
        e.stopPropagation();
        setAnchorEl(null);
        await props.signOut() 
    }
    const createAvatarPlaceholder = (name) => {

        if (!(/\s/.test(name))) {
            return name.charAt(0).toUpperCase()
        }
        
        const initials = name.split(" ").map(word => {
            return word.charAt(0)
        }).join('').toUpperCase()

        return initials
    }


    const togglePasswordChangeModal = () => {
        setShowPasswordChangeModal(prev => !prev)
        setAnchorEl(null)
    }

    const handleCloseAlertSnackbar = () => {
        setShowAlertSnackbar(prev => !prev)
    }


    const avatar = true
    //console.log(props.auth)



    return(
        <StyledAppBar  position="static" id="navbar" hide={hideNavbar ? 1 : 0}>
        <Toolbar>
            {props.auth.uid && props.auth.profile.name ? (
                <React.Fragment>
                    <Badge
                        style={{height: 30, width: 30, marginRight: '0.5rem'}}
                        overlap="circle"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                    >
                        {props.auth.profile.avatar ? <Avatar style={{height: 30, width:30}} alt="avatar" src={usersPath + props.auth.profile.avatar} /> : <Avatar style={{height: 30, width: 30}}>{createAvatarPlaceholder(props.auth.profile.name)}</Avatar>}
                    </Badge>
                    <Typography variant="h6" style={{flexGrow: 1, textAlign: 'left'}}>
                        {props.auth.profile.name}
                    </Typography>
                    
                    <Button
                        style={{justifyContent: 'flex-end'}}
                        onClick={handleClick}
                    >
                            <MenuIcon style={{margin: "0", color: 'white'}} />
                    </Button>
                
                    
                    
                    <StyledMenu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        elevation={2}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center"
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "center"
                        }}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                
                                <AccountBoxIcon />
                            </ListItemIcon>
                            <ListItemText>
                                <FileInputButton color="primary">
                                    {props.auth.profile.avatar ? "Zmień avatar" : "Dodaj avatar"}
                                </FileInputButton>
                                <HiddenFileInput
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </ListItemText>
                        </StyledMenuItem>
                        {props.auth.profile.avatar && 
                            <StyledMenuItem>
                                
                                <ListItemIcon>
                                    <DeleteForeverIcon />
                                </ListItemIcon>
                                
                                
                                <ListItemText>
                                <Link onClick={handleAvatarDelete} underline='none' color="primary">
                                    Usuń avatar  
                                </Link>
                                </ListItemText>
                            </StyledMenuItem>
                        }
                        <StyledMenuItem>
                            <ListItemIcon>
                                <LockIcon/>
                            </ListItemIcon>
                            <ListItemText>
                                <Link onClick={togglePasswordChangeModal} underline="none" color="primary">
                                    Zmień hasło
                                </Link>
                            </ListItemText>
                        </StyledMenuItem>
                        <StyledMenuItem>
                                
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            
                            
                            <ListItemText>
                            <Link onClick={handleLogout} underline='none' color="primary">
                                Wyloguj  
                            </Link>
                            </ListItemText>
                        </StyledMenuItem>
                    </StyledMenu>
                </React.Fragment>
            ) : (
                
                <React.Fragment>
                    <Typography variant="h6" style={{flexGrow: 1, textAlign: 'left'}} >
                        <Link href='/' to='/' underline='none' style={{color: 'white'}}>
                            Loyal Goblin
                        </Link>
                    </Typography>
                    {/* <Typography>
                        <Link href='/signin' to='/signin'  nderline='none' style={{color: 'white', marginRight: '1rem'}}>
                            Zaloguj
                        </Link>
                    </Typography>
                    <Typography>
                        <Link href='/signup' to='/signup' underline='none' style={{color: 'white'}}>
                            Dołącz
                        </Link>
                    </Typography> */}
                </React.Fragment>
            )}
        </Toolbar>
        <ChangePasswordModal open={showPasswordChangeModal} handleClose={togglePasswordChangeModal}/>
        <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={showAlertSnackbar}
        autoHideDuration={6000}
       onClose={handleCloseAlertSnackbar}
       message="Maksymalna wielkosć pliku to 6 MB!"
        />
        </StyledAppBar>
        
       
    )
}




const mapStateToProps = (state) => {
    return {
        auth: state.auth,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateAvatar: (avatar) => dispatch(updateAvatar(avatar)),
        signOut: () => dispatch(signOut())
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Navbar)