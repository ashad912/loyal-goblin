import React from 'react'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer'
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
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import LockIcon from '@material-ui/icons/Lock';
import { Badge } from '@material-ui/core';
import { connect } from 'react-redux';
import { useHistory } from "react-router";
import { Link } from '@material-ui/core';
import {updateAvatar} from '../../store/actions/profileActions'
import {signOut} from '../../store/actions/authActions'
import ChangePasswordModal from '../auth/ChangePasswordModal';
import RankDialog from "./RankDialog";
import StatsDialog from "./StatsDialog";
import { uiPaths, usersPath } from '../../utils/definitions';
import { PintoTypography } from '../../utils/fonts';


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

    const [showDrawer, setShowDrawer] = React.useState(null);
    const [showRankDialog, setShowRankDialog] = React.useState(false);
    const [showStatsDialog, setShowStatsDialog] = React.useState(false);
    const [showPasswordChangeModal, setShowPasswordChangeModal] = React.useState(false)
    const [hideNavbar, setHideNavbar] = React.useState(false)
    const [showAlertSnackbar, setShowAlertSnackbar] = React.useState(false)
    const [alertMessage, setAlertMessage] = React.useState('')

    const history = useHistory()

    React.useEffect(()=>{
        if(!props.auth.uid){
            setHideNavbar(true)
        }else{
            setHideNavbar(false)
        }
    }, [props.auth.uid])

    const handleClick = event => {
        event.stopPropagation();
        setShowDrawer(event.currentTarget);
    };

    const handleClose = event => {
        event.stopPropagation();
        setShowDrawer(null);
    };

    const handleAvatarChange = async e => {
        if (e.target.files.length > 0) {
            const avatar = e.target.files[0]
            const avatarSize = avatar.size / 1024 / 1024; // in MB
            
            if(avatarSize >= 6){
                setAlertMessage("Maksymalna wielkosć pliku to 6 MB!")
                setShowAlertSnackbar(true)  
            }else if(!avatar.type.includes('image/')){
                setAlertMessage("Nieprawidłowe rozszerzenie pliku!")
                setShowAlertSnackbar(true)   
            }else{
                const formData = new FormData()
                formData.append("avatar", avatar)
                e.stopPropagation();
                setShowDrawer(null);
                await props.updateAvatar(formData)
            }
        }
    };

    const handleAvatarDelete = async e => {
        e.stopPropagation();
        setShowDrawer(null);
        await props.updateAvatar();      
    };

    const handleLogout = async e => {
        e.stopPropagation();
        setShowDrawer(null);
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
        setShowDrawer(null)
    }

    const handleCloseAlertSnackbar = () => {
        setShowAlertSnackbar(prev => !prev)
        setAlertMessage('')
    }

    const toggleStatsDialog = () => {
        setShowStatsDialog(prev => !prev)
        setShowDrawer(null)
    }

    const toggleRankDialog = () => {
        setShowRankDialog(prev => !prev)
        setShowDrawer(null)
    }

    

    const handleBack = () => {
        var indexRedirect = 0
        switch (window.location.pathname) {
            case '/mission':
                indexRedirect = 2;
                break;
            default:
                break;
        }

        history.push({
            pathname: "/",
            state: { indexRedirect}
        });
    }

    const isBackButtonVisible = ['/shop', '/mission'].includes(window.location.pathname)
    const toolbarPaddingLeft = isBackButtonVisible ? '0px' : '16px'

    return(
        <StyledAppBar  position="static" id="navbar" hide={hideNavbar ? 1 : 0}>
        <Toolbar style={{paddingLeft: toolbarPaddingLeft}}>
            
            {props.auth.uid && props.auth.profile.name ? (
                <React.Fragment>
                    {isBackButtonVisible && (
                        <Button 
                            onClick={handleBack}
                            style={{
                                minWidth: '0',
                                
                            }} 
                        >  
                            <KeyboardArrowLeftIcon
                                style={{
                                    color: 'white',
                                    fontSize: '2.5rem',
                                }}
                            />  
                        </Button>
                    )}
                    <Badge
                        style={{height: '2rem', width: '2rem'}}
                        overlap="circle"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                    >
                        {props.auth.profile.avatar ? <Avatar style={{height: 30, width:30}} alt="avatar" src={usersPath + props.auth.profile.avatar} /> : <Avatar style={{height: 30, width: 30}}>{createAvatarPlaceholder(props.auth.profile.name)}</Avatar>}
                    </Badge>
                    <Typography variant="h6" style={{flexGrow: 1, textAlign: 'left', marginLeft: '1rem'}}>
                        {props.auth.profile.name}
                    </Typography>
                    
                    <Button
                        style={{justifyContent: 'flex-end'}}
                        onClick={handleClick}
                    >
                            <MenuIcon style={{margin: "0", color: 'white'}} />
                    </Button>
                    <Drawer anchor="right" open={Boolean(showDrawer)} onClose={handleClose} disableBackdropTransition={true} >
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '45vw', height: '100%', padding: '1rem 0.5rem'}}>
                            <StyledMenuItem>
                                <ListItemIcon>
                                    <img src={uiPaths.statistics} style={{width: '1.2rem', height: '1.2rem', paddingLeft: '0.2rem'}}/>
                                </ListItemIcon>
                                <ListItemText>
                                    <Link onClick={toggleStatsDialog} underline='none' color="primary">
                                        <PintoTypography>Statystyki</PintoTypography>  
                                    </Link>
                                </ListItemText>
                            </StyledMenuItem>
                            <StyledMenuItem>
                                <ListItemIcon>
                                    <img src={uiPaths.ranking} style={{width: '1.2rem', height: '1.2rem', paddingLeft: '0.2rem'}}/>
                                </ListItemIcon>
                                <ListItemText>
                                    <Link onClick={toggleRankDialog} underline='none' color="primary">
                                        <PintoTypography>Ranking</PintoTypography>  
                                    </Link>
                                </ListItemText>
                            </StyledMenuItem>
                            <StyledMenuItem>
                                <ListItemIcon>
                                    
                                    <AccountBoxIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    <FileInputButton color="primary">
                                        <PintoTypography>{props.auth.profile.avatar ? "Zmień avatar" : "Dodaj avatar"}</PintoTypography>
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
                                        <PintoTypography>Usuń avatar</PintoTypography>  
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
                                        <PintoTypography>Zmień hasło</PintoTypography>
                                    </Link>
                                </ListItemText>
                            </StyledMenuItem>
                            <StyledMenuItem>
                                    
                                <ListItemIcon>
                                    <ExitToAppIcon />
                                </ListItemIcon>
                                
                                
                                <ListItemText>
                                <Link onClick={handleLogout} underline='none' color="primary">
                                    <PintoTypography>Wyloguj</PintoTypography>
                                </Link>
                                </ListItemText>
                            </StyledMenuItem>
                        </div>
       
                    </Drawer>
                    
                    {showRankDialog && (
                        <RankDialog
                            open={showRankDialog}
                            profile={props.auth.profile}
                            uid={props.auth.uid}
                            handleClose={toggleRankDialog}
                        />
                    )}

                        <StatsDialog
                            open={showStatsDialog}
                            profile={props.auth.profile}
                            handleClose={toggleStatsDialog}
                        />
                    
                   
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
            {showAlertSnackbar && <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={showAlertSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseAlertSnackbar}
                message={alertMessage}
            />}
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