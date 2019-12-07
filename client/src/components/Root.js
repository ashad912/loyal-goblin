import React, { useEffect } from "react";
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
      <Box p={4}>{children}</Box>
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
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1
  }
}));

export default function FullWidthTabs(props) {
  //TODO: Verify if user has a character from db object, not local storage
  const [
    showCharacterCreationModal,
    setShowCharacterCreationModal
  ] = React.useState(!Boolean(localStorage.getItem("characterCreated")));
  const [fullHeightCorrection, setFullHeightCorrection] = React.useState(0);
  useEffect(() => {
    //change tab, when returing from specific event
    if (props.location.state && props.location.state.indexRedirect !== null) {
      const redirectToIndex = props.location.state.indexRedirect;
      props.history.replace("", null);
      setValue(redirectToIndex);
    }

    
  }, []);

  useEffect(() => {
    if (!showCharacterCreationModal) {
      if (!showCharacterCreationModal) {
        const appBar = document.getElementById("app-bar").offsetHeight;
        const navbar = document.getElementById("navbar").offsetHeight;
        const footer = document.getElementById("footer").offsetHeight;
        setFullHeightCorrection(appBar + navbar + footer);
      }
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

  const handleCharacterCreationFinish = () => {
    setShowCharacterCreationModal(false);
    localStorage.setItem("characterCreated", 1);
  };

  return (
    <div className={classes.root}>
      {showCharacterCreationModal ? (
        <Dialog
          fullScreen
          open={showCharacterCreationModal}
          onClose={handleCharacterCreationFinish}
        >
          <CharacterCreation onFinish={handleCharacterCreationFinish} />
        </Dialog>
      ) : (
        <React.Fragment>
          <AppBar position="static" color="default" id="app-bar">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              aria-label="full width tabs example"
              variant="fullWidth"
            >
              <Tab label="Postać" {...a11yProps(0)} />
              <Tab label="Wydarzenia" {...a11yProps(1)} />
              <Tab label="Statki" {...a11yProps(2)} />
              <Tab label="Rezerwuj" {...a11yProps(3)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
            style={{ minHeight: `calc(100vh - ${fullHeightCorrection}px)` }}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <Profile />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <Events />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <Loyal />
            </TabPanel>
            <TabPanel value={value} index={3} dir={theme.direction}>
              <Booking/>
            </TabPanel>
          </SwipeableViews>
        </React.Fragment>
      )}
    </div>
  );
}
