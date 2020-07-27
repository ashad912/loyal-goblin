import React from 'react'
import { connect } from 'react-redux';
import { useHistory } from "react-router";
import styled from 'styled-components'

import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer'
import Input from '@material-ui/core/Input';
import Snackbar from '@material-ui/core/Snackbar';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import MenuIcon from "@material-ui/icons/Menu";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import LockIcon from '@material-ui/icons/Lock';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Link } from '@material-ui/core';

import ChangePasswordModal from 'components/auth/ChangePasswordModal';
import RankDialog from "./RankDialog";
import StatsDialog from "./StatsDialog";

import NavbarMenu from './NavbarMenu';
import NavbarMenuItem from './NavbarMenuItem';

import { updateAvatar } from 'store/actions/profileActions'
import { signOut } from 'store/actions/authActions'
import { togglePresenceInInstance } from 'store/actions/missionActions'
import { leaveShop } from 'store/actions/shopActions'

import { uiPaths } from 'utils/constants';
import { PintoTypography } from 'assets/fonts';
import AvatarWithPlaceholder from 'components/AvatarWithPlaceholder';
import { setNavbarHeight } from 'store/actions/layoutActions';


const StyledAppBar = styled(AppBar)`
    display: ${props => props.none && 'none'};
    position: ${props => props.sticky ? 'sticky' : 'static'};
    top: 0;
    transform: ${props => props.show ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)'};
    transition: transform 0.4s linear;    
`

const HiddenFileInput = styled(Input)`
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    height: 100%;
    width: 100%;
    user-select: none;`;



const Navbar = (props) => {

    const [showDrawer, setShowDrawer] = React.useState(null);
    const [showRankDialog, setShowRankDialog] = React.useState(false);
    const [showStatsDialog, setShowStatsDialog] = React.useState(false);
    const [showPasswordChangeModal, setShowPasswordChangeModal] = React.useState(false)
    const [noneNavbar, setNoneNavbar] = React.useState(false)
    const [showAlertSnackbar, setShowAlertSnackbar] = React.useState(false)
    const [alertMessage, setAlertMessage] = React.useState('')
    const [enableSticky, setEnableSticky] = React.useState(false)
    const [isNavbarShow, setIsNavbarShow] = React.useState(true)

    const lastScroll = React.useRef(0)
    const navbarRef = React.useRef()
    const navbarHeight = React.useRef(0)
    const navbarShow = React.useRef(true)
    const history = useHistory()


    const updateNavbarSticky = (pathname) => {
        const isEnableSticky = ['/shop'].includes(pathname)
        if (isEnableSticky) {
            setEnableSticky(true)
            window.addEventListener("scroll", handleScrollPosition);
        } else {
            setEnableSticky(false)
            setIsNavbarShow(true)
            navbarShow.current = true;
            window.removeEventListener("scroll", handleScrollPosition);
        }
    }

    history.listen((location, action) => {
        updateNavbarSticky(location.pathname)
    })

    React.useEffect(() => {

        const height = navbarRef.current && navbarRef.current.clientHeight
        navbarHeight.current = height

        updateNavbarSticky(window.location.pathname)

    }, [])

    React.useLayoutEffect(() => {
        if (navbarRef.current) {
            props.setNavbarHeight(navbarRef.current.offsetHeight)
        }
    }, []);

    React.useEffect(() => {
        if (!props.auth.uid) {
            setNoneNavbar(true)
        } else {
            setNoneNavbar(false)
        }
    }, [props.auth.uid])



    const handleScrollPosition = () => {
        // handleScrollPosition it's callback registred for scroll listener and we're using functional component - SIDE EFFECTS:

        // handleScrollPosition cannot read updated state, however can update state
        // handleScrollPosition can read ref.current and update ref.current
        // <StyledAppBar></StyledAppBar> jsx element cannot read updated ref, but can read updated state
        // That's why below...

        // FOR (static<->sticky) change: (window.pageYOffset > navbarHeight.current ) || navbarShow.current) to prevent navbar 'drop' when we are very close to the top
        // console.log(window.pageYOffset, lastScroll.current)
        if (window.pageYOffset < lastScroll.current) {
            if (!navbarShow.current) {
                //console.log('up')
                navbarShow.current = true;
                setIsNavbarShow(true)
            }


        } else if (window.pageYOffset > lastScroll.current) {
            if (navbarShow.current) {
                //console.log('down or too high')
                navbarShow.current = false;
                setIsNavbarShow(false)

            }
        }
        lastScroll.current = window.pageYOffset

    }

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

            if (avatarSize >= 6) {
                setShowDrawer(null);
                setAlertMessage("Maksymalna wielkosć pliku to 6 MB!")
                setShowAlertSnackbar(true)
            } else if (!avatar.type.includes('image/')) {
                setShowDrawer(null);
                setAlertMessage("Nieprawidłowe rozszerzenie pliku!")
                setShowAlertSnackbar(true)
            } else {
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



    const handleBack = async () => {
        window.removeEventListener("scroll", handleScrollPosition);

        let state = {}
        switch (window.location.pathname) {
            case '/mission':
                if (props.activeMission) {
                    const user = { _id: props.auth.uid, inMission: false, readyStatus: false }
                    try {
                        await togglePresenceInInstance(user, props.party._id)
                    } catch (e) { }
                    state.indexRedirect = 2
                } else {
                    state.authCheck = true
                    state.indexRedirect = 0
                }

                break;
            case '/shop':
                state.indexRedirect = 0
                break;
            default:
                break;
        }

        history.push({
            pathname: "/",
            state
        });
    }

    const isBackButtonVisible = ['/shop', '/mission'].includes(window.location.pathname)
    const toolbarPaddingLeft = isBackButtonVisible ? '0px' : '16px'

    // <StyledAppBar></StyledAppBar> jsx element cannot read updated ref, but can read updated state
    return (
        <StyledAppBar
            ref={navbarRef}
            position="static"
            id="navbar"
            sticky={enableSticky ? 1 : 0}
            show={isNavbarShow ? 1 : 0}
            none={noneNavbar ? 1 : 0}
        >
            <Container maxWidth="xs" style={{ padding: 0 }}>
                <Toolbar style={{ paddingLeft: toolbarPaddingLeft }}>

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
                            <img src={uiPaths.logo} style={{height: '50px'}} alt="logo"/>   
                            <PintoTypography variant="h6" style={{ flexGrow: 1, textAlign: 'right', marginRight: '1rem' }}>
                                {props.auth.profile.name}
                            </PintoTypography>
                            <AvatarWithPlaceholder
                                avatar={props.auth.profile.avatar}
                                width="30px"
                                height="30px"
                                placeholder={{
                                    text: props.auth.profile.name,
                                }}
                                style={{
                                    textAlign: 'right'
                                }}
                            />


                            

                            <Button
                                style={{ justifyContent: 'flex-end' }}
                                onClick={handleClick}
                            >
                                <MenuIcon style={{ margin: "0", color: 'white' }} />
                            </Button>
                            <Drawer anchor="right" open={Boolean(showDrawer)} onClose={handleClose} >
                                <NavbarMenu>
                                    <NavbarMenuItem
                                        onClick={toggleStatsDialog}
                                        icon={
                                            <img src={uiPaths.statistics} alt="stats" style={{ width: '1.2rem', height: '1.2rem', paddingLeft: '0.2rem' }} />
                                        }
                                        action={
                                            <Link underline='none' color="primary">
                                                <PintoTypography>Statystyki</PintoTypography>
                                            </Link>
                                        }
                                    />
                                    <NavbarMenuItem
                                        onClick={toggleRankDialog}
                                        icon={
                                            <img src={uiPaths.ranking} alt="ranking" style={{ width: '1.2rem', height: '1.2rem', paddingLeft: '0.2rem' }} />
                                        }
                                        action={
                                            <Link underline='none' color="primary">
                                                <PintoTypography>Ranking</PintoTypography>
                                            </Link>
                                        }
                                    />
                                    <NavbarMenuItem
                                        icon={
                                            <AccountBoxIcon />
                                        }
                                        action={
                                            <React.Fragment>
                                                <PintoTypography color="primary">
                                                    {props.auth.profile.avatar ? "Zmień avatar" : "Dodaj avatar"}
                                                </PintoTypography>
                                                <HiddenFileInput
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                />
                                            </React.Fragment>
                                        }
                                    />
                                    {props.auth.profile.avatar &&
                                        <NavbarMenuItem
                                            onClick={handleAvatarDelete}
                                            icon={
                                                <DeleteForeverIcon />
                                            }
                                            action={
                                                <Link underline='none' color="primary">
                                                    <PintoTypography>Usuń avatar</PintoTypography>
                                                </Link>
                                            }
                                        />
                                    }
                                    <NavbarMenuItem
                                        onClick={togglePasswordChangeModal}
                                        icon={
                                            <LockIcon />
                                        }
                                        action={
                                            <Link underline="none" color="primary">
                                                <PintoTypography>Zmień hasło</PintoTypography>
                                            </Link>
                                        }
                                    />
                                    <NavbarMenuItem
                                        onClick={() => window.location.reload(true)}
                                        icon={
                                            <RefreshIcon />
                                        }
                                        action={
                                            <Link underline='none' color="primary">
                                                <PintoTypography>Odśwież</PintoTypography>
                                            </Link>
                                        }
                                    />
                                    <NavbarMenuItem
                                        onClick={handleLogout}
                                        icon={
                                            <ExitToAppIcon />
                                        }
                                        action={
                                            <Link underline='none' color="primary">
                                                <PintoTypography>Wyloguj</PintoTypography>
                                            </Link>
                                        }
                                    />
                                </NavbarMenu>
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
                                <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'left' }} >
                                    <Link href='/' to='/' underline='none' style={{ color: 'white' }}>
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
                <ChangePasswordModal open={showPasswordChangeModal} handleClose={togglePasswordChangeModal} />
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
            </Container>
        </StyledAppBar>

    )
}




const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        party: state.party,
        activeMission: state.mission.activeInstanceId,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setNavbarHeight: (navbarHeight) => dispatch(setNavbarHeight(navbarHeight)),
        updateAvatar: (avatar) => dispatch(updateAvatar(avatar)),
        signOut: () => dispatch(signOut()),
        onLeaveShop: () => dispatch(leaveShop()),

    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Navbar)