import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import Profile from "./screens/Profile";
import Events from "./screens/Events";
import Loyal from "./screens/Loyal";
import CharacterCreation from "./screens/CharacterCreation";
import Booking from "./screens/Booking";
import RootSnackbar from "./layout/RootSnackbar";
import {socket, multipleSessionSubscribe} from '../socket'
import styled from 'styled-components'
import { createCharacter, getAllNames, clearAllNames } from "../store/actions/profileActions";
import { authCheck } from "../store/actions/authActions";
import Party from "./screens/Party";
import { uiPaths, palette } from "../utils/definitions";

const StyledTab = styled(Tab)`
  font-family: Pinto-0;
  color: ${props => props.active ? palette.primary.main : 'black'}
`

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={4} style={{paddingTop: (index===1 || index===3 || index===4) && '0', paddingBottom: (index===1 || index===3 || index===4) && '0' }}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#ffffff',
    flexGrow: 1,
  }
}));

function Root(props) {
  //TODO: Verify if user has a character from db object, not local storage
  const [
    showCharacterCreationModal,
    setShowCharacterCreationModal
  ] = React.useState(true);
  const [fullHeightCorrection, setFullHeightCorrection] = React.useState(0);
  const [characterCreationError, setCharacterCreationError] = React.useState(false)

  const [footerReached, setFooterReached] = React.useState(false)

  const trackScrolling = () => {
    const isTop = (el) => {
      return el.getBoundingClientRect().top <= window.innerHeight;
    }

    const wrappedElement = document.getElementById('footer');
    if (isTop(wrappedElement)) {  
      setFooterReached(true)
      //document.removeEventListener('scroll', this.trackScrolling);
    }else{
      setFooterReached(false)
    }
  };


  useEffect(() => {
    //change tab, when returing from specific event
    if (props.location.state && props.location.state.hasOwnProperty("indexRedirect")) {
      const redirectToIndex = props.location.state.indexRedirect;
      props.history.replace("", null);
      setValue(redirectToIndex);
    }

    multipleSessionSubscribe((socketId) => {
      console.log('multipe session', socketId)
    })

    if(props.auth.profile.name && props.auth.profile.class){
      setShowCharacterCreationModal(false)
    }else{
      props.onGetAllNames()
    }
    document.addEventListener('scroll', trackScrolling);

    return () => {
      document.removeEventListener('scroll', trackScrolling);
    }
  }, []);


  useEffect(() => {

      if (!showCharacterCreationModal) {
        const appBar = document.getElementById("app-bar").offsetHeight;
        const navbar = document.getElementById("navbar").offsetHeight;
        const footer = document.getElementById("footer").offsetHeight;
        setFullHeightCorrection(appBar + navbar + footer);
      }
    
  }, [showCharacterCreationModal]);

  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  const handleCharacterCreationFinish = async (name, sex, charClass, attributes) => {
    try{
      await props.onCreateCharacter(name, sex, charClass, attributes)
      props.onClearAllNames()
      await props.onAuthCheck()
      setShowCharacterCreationModal(false)
    }catch(e){
      setCharacterCreationError(true)
    }
    
  };

  const fullHeight = `calc(100vh - ${fullHeightCorrection}px)`


  return (
    <div className={classes.root}>
      {showCharacterCreationModal ? (
        <Dialog
          fullScreen
          open={showCharacterCreationModal}
          onClose={handleCharacterCreationFinish}
        >
          <CharacterCreation onFinish={handleCharacterCreationFinish} allNames={props.auth.allNames} submitError={characterCreationError} resetSubmitError={()=>setCharacterCreationError(false)}/>
        </Dialog>
      ) : (
        <React.Fragment>
          <AppBar position="static" color="white" id="app-bar">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              aria-label="full width tabs example"
              variant="fullWidth"
            >
              <StyledTab  active={value === 0 ? 1 : 0} label="Postać" {...a11yProps(0)}/>
              <StyledTab  active={value === 1 ? 1 : 0}  label="Drużyna" {...a11yProps(1)} />
              <StyledTab  active={value === 2 ? 1 : 0}  label="Wydarzenia" {...a11yProps(2)} />
              <StyledTab  active={value === 3 ? 1 : 0}  label="Statki" {...a11yProps(3)} />
              <StyledTab  active={value === 4 ? 1 : 0}  label="Rezerwuj" {...a11yProps(4)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
            style={{ minHeight: fullHeight }}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <Profile fullHeight={fullHeight}/>
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
             <Party fullHeight={fullHeight}/>
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <Events fullHeight={fullHeight}/>
            </TabPanel>
            <TabPanel value={value} index={3} dir={theme.direction}>
              <Loyal fullHeight={fullHeight}/>
            </TabPanel>
            <TabPanel value={value} index={4} dir={theme.direction}>
              <Booking fullHeight={fullHeight}/>
            </TabPanel>
          </SwipeableViews>
        </React.Fragment>
      )}

        
    <RootSnackbar socket={socket} screen={value} hide={footerReached} />
    </div>
  );
}


const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCreateCharacter: (name, sex, charClass, attributes) => dispatch(createCharacter(name, sex, charClass, attributes)),
    onAuthCheck: () => dispatch(authCheck()),
    onGetAllNames: () => dispatch(getAllNames()),
    onClearAllNames: ()=>dispatch(clearAllNames())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);
