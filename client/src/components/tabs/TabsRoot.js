import React, { useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import styled from 'styled-components'

import Container from '@material-ui/core/Container';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import Profile from "./profile/Profile";
import Party from "./party/Party";
import Events from "./events/Events";
import Loyal from "./loyal/Loyal";
import Booking from "./booking/Booking";
import Loading from "components/layout/Loading";

import TabsSnackbar from "./TabsSnackbar";
import WarningDialog from "./WarningDialog";


import { socket } from 'socket'

import { authCheck } from "store/actions/authActions";
import { leaveShop } from "store/actions/shopActions";

import { getFirstRally } from "store/actions/rallyActions";
import { getMissionList } from "store/actions/missionActions";
import { updateParty } from "store/actions/partyActions";

import { palette } from "utils/constants";
import { setAppBarHeight } from "store/actions/layoutActions";





const StyledTab = styled(Tab)`
  font-family: Pinto-0;
  color: ${props => props.active ? palette.primary.main : 'black'}
  @media (min-width: 960px){
    min-width: 0px;
  }
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
      <Box p={4} style={{ paddingTop: (index === 1 || index === 3 || index === 4) && '0', paddingBottom: (index === 1 || index === 3 || index === 4) && '0' }}>{children}</Box>
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

function TabsRoot(props) {

  const [loaded, setLoaded] = React.useState(false)
  const [footerReached, setFooterReached] = React.useState(false)
  const [value, setValue] = React.useState(0);

  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();

  const appBarRef = useRef()

  // function useTraceUpdate(props) {
  //   const prev = React.useRef(props);
  //   useEffect(() => {
  //     const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
  //       if (prev.current[k] !== v) {
  //         ps[k] = [prev.current[k], v];
  //       }
  //       return ps;
  //     }, {});
  //     if (Object.keys(changedProps).length > 0) {
  //       console.log('Changed props:', changedProps);
  //     }
  //     prev.current = props;
  //   });
  // }

  // useTraceUpdate(props);

  useEffect(() => {

    updateGlobalStore()

    //change tab, when returing from specific event
    if (props.location.state && props.location.state.hasOwnProperty("indexRedirect")) {
      changeValue(props.location.state.indexRedirect);
    } else if (sessionStorage.tabIndex) {
      changeValue(parseInt(sessionStorage.tabIndex))
    }

    history.replace("", null);
    document.addEventListener('scroll', trackScrolling);

    setLoaded(true)


    return () => {
      document.removeEventListener('scroll', trackScrolling);
    }
  }, []);

  useEffect(() => {
    if (props.party.inShop && props.party.leader._id === props.auth.uid) {
      props.onLeaveShop();
    }
  }, [props.party.inShop]);

  useEffect(() => {
    if (appBarRef.current) {
      props.setAppBarHeight(appBarRef.current.offsetHeight)
    }
  }, [loaded]);


  const updateGlobalStore = async () => {
    let requests = [
      props.onPartyUpdate(),
      props.getMissionList(),
      props.getRally()
    ]

    try {
      if (
        props.location.state &&
        props.location.state.hasOwnProperty("authCheck")
      ) {
        requests = [props.onAuthCheck(), ...requests]
      }
      await Promise.all(requests)
    } catch (e) {
      console.log(e)
    }
  }

  const trackScrolling = () => {
    const isTop = (el) => {
      return el.getBoundingClientRect().top <= window.innerHeight;
    }

    const wrappedElement = document.getElementById('footer');
    if (isTop(wrappedElement)) {
      setFooterReached(true)
      //document.removeEventListener('scroll', this.trackScrolling);
    } else {
      setFooterReached(false)
    }
  };

  const changeValue = (newValue) => {
    setValue(newValue);
    sessionStorage.tabIndex = newValue
  }

  const handleChange = (event, newValue) => {
    changeValue(newValue);
  };

  const handleChangeIndex = index => {
    changeValue(index);
  };

  if (!loaded) {
    return <Loading />
  }

  const fullHeight = `calc(100vh - ${props.fullHeightCorrection}px)`

  return (

    <div className={classes.root}>

      <AppBar position="static" color="inherit" id='app-bar' ref={appBarRef}>
        <Container maxWidth='xs' style={{ padding: 0 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            aria-label="full width tabs example"
            variant="fullWidth"
          >
            <StyledTab active={value === 0 ? 1 : 0} label="Postać" {...a11yProps(0)} />
            <StyledTab active={value === 1 ? 1 : 0} label="Drużyna" {...a11yProps(1)} />
            <StyledTab active={value === 2 ? 1 : 0} label="Wydarzenia" {...a11yProps(2)} />
            <StyledTab active={value === 3 ? 1 : 0} label="Statki" {...a11yProps(3)} />
            <StyledTab active={value === 4 ? 1 : 0} label="Rezerwuj" {...a11yProps(4)} />
          </Tabs>
        </Container>
      </AppBar>
      <Container maxWidth='xs' style={{ padding: 0 }}>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
          style={{ minHeight: fullHeight }}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Profile fullHeight={fullHeight} />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Party fullHeight={fullHeight} />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Events fullHeight={fullHeight} />
          </TabPanel>
          <TabPanel value={value} index={3} dir={theme.direction}>
            <Loyal fullHeight={fullHeight} />
          </TabPanel>
          <TabPanel value={value} index={4} dir={theme.direction}>
            <Booking fullHeight={fullHeight} />
          </TabPanel>
        </SwipeableViews>

        <TabsSnackbar
          socket={socket}
          screen={value}
          hide={footerReached}
        />

        <WarningDialog />
      </Container>

    </div>
  );
}


const mapStateToProps = state => {
  return {
    auth: state.auth,
    party: state.party,
    fullHeightCorrection: state.layout.appBarHeight + state.layout.navbarHeight + state.layout.footerHeight
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAppBarHeight: (appBarHeight) => dispatch(setAppBarHeight(appBarHeight)),
    onAuthCheck: () => dispatch(authCheck()),
    onPartyUpdate: (params, socketAuthReconnect) =>
      dispatch(updateParty(params, socketAuthReconnect)),
    getMissionList: () => dispatch(getMissionList()),
    getRally: () => dispatch(getFirstRally()),
    onLeaveShop: () => dispatch(leaveShop()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabsRoot);
