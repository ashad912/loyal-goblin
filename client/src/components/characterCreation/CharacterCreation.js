import React, { useState, useCallback } from "react";
import { connect } from "react-redux";
import _ from "lodash";


import { makeStyles } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { Typography, Dialog } from "@material-ui/core";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import { createCharacter, getAllNames, clearAllNames } from "store/actions/profileActions";





const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: 'relative'
  },
  paper: {
    width: "90%",
    height: "100%",
    padding: "0.5rem",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  }
}));

const CharacterCreation = props => {
  const classes = useStyles();

  const [characterCreationError, setCharacterCreationError] = React.useState(false)
  const [activeStep, setActiveStep] = useState(0);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [name, setName] = useState("");
  const [nameTaken, setNameTaken] = useState(false);
  const [sex, setSex] = useState("");
  const [characterClass, setCharacterClass] = useState("");
  const [attributePool, setAttributePool] = useState(3);
  const [attributes, setAttributes] = useState({
    strength: 1,
    dexterity: 1,
    magic: 1,
    endurance: 1
  });

  const stepperRef = React.useRef()
  const isMountedRef = React.useRef()

  React.useEffect(() => {
    if(props.auth.profile && !props.auth.profile.name){
      props.onGetAllNames()
    }
  }, [])

  React.useEffect(() => {
    let buttonDisabled = true;
    if (name.length > 1 && activeStep === 0 && !nameTaken) {
      buttonDisabled = false;
    }
    if (sex !== "" && activeStep === 1) {
      buttonDisabled = false;
    }
    if (characterClass !== "" && activeStep === 2) {
      buttonDisabled = false;
    }
    if (attributePool === 0 && activeStep === 3) {
      buttonDisabled = false;
    }
    if (activeStep === 4) {
      buttonDisabled = false;
    }

    setNextDisabled(buttonDisabled);
  }, [activeStep, name, sex, characterClass, attributePool, nameTaken]);


  const handleCharacterCreationFinish = async (name, sex, charClass, attributes) => {
    try{
      props.onClearAllNames()
      await props.onCreateCharacter(name, sex, charClass, attributes) 
    }catch(e){
      setCharacterCreationError(true)
      setActiveStep(0)
      setTimeout(() => {
        setCharacterCreationError(false)
      }, 5000);
    }
  }



  const handleNameChange = event => {
    const value = event.target.value.toLowerCase()
    if (
      (/^[a-ząćęłńóśźż0-9][a-ząćęłńóśźż0-9\s]*$/.test(
        value
      ) ||
      value === "") &&
      value.length <= 20
    ) {
      if (value.split(" ").length < 3) {
        setName(value);
        setNameTaken(false);
      }
    }
  };

  const handleCheckAllNames = useCallback(
    _.debounce(value => {
      if (!props.auth.allNames.find(name => name === value.toLowerCase())) {
        setNameTaken(false);
      } else {
        setNameTaken(true);
      }
     
    }, 500)
  );



  const handleSexChange = event => {
    setSex(event.target.value);
  };

  const handleCharacterClassChange = event => {
    setCharacterClass(event.target.value);
    const attributesTemp = {
      strength: 1,
      dexterity: 1,
      magic: 1,
      endurance: 1
    };
    switch (event.target.value) {
      case "warrior":
        attributesTemp.strength = 2;

        break;
      case "mage":
        attributesTemp.magic = 2;

        break;
      case "rogue":
        attributesTemp.dexterity = 2;

        break;
      case "cleric":
        attributesTemp.endurance = 2;

        break;

      default:
        break;
    }
    setAttributes(attributesTemp);
    setAttributePool(3)
  };

  const handleAttributeChange = (event, attributeName, value) => {
    const tempAttributes = { ...attributes };
    if (value > 0 && attributePool <= 0) {
      return;
    }
    if (tempAttributes[attributeName] + value <= 0) {
      return;
    }

    const classAttributes = {
      strength: "warrior",
      dexterity: "rogue",
      magic: "mage",
      endurance: "cleric"
    };

    if (
      characterClass === classAttributes[attributeName] &&
      tempAttributes[attributeName] + value <= 1
    ) {
      return;
    }
    tempAttributes[attributeName] += value;
    setAttributes(tempAttributes);
    setAttributePool(prev => prev - value);
  };

  const stepperHeight =  stepperRef.current ? stepperRef.current.clientHeight : '0'

  const steps = [
    <Step1 handleChange={handleNameChange} handleCheck={handleCheckAllNames} value={name} nameTaken={nameTaken}/>,
    <Step2 handleChange={handleSexChange} value={sex} />,
    <Step3 handleChange={handleCharacterClassChange} value={characterClass}       stepperHeight={stepperHeight}/>,
    <Step4
      handleChange={handleAttributeChange}
      values={attributes}
      attributePool={attributePool}

    />,
    <Step5
      name={name}
      sex={sex}
      characterClass={characterClass}
      attributes={attributes}
      stepperHeight={stepperHeight}
    />
  ];

  const maxSteps = steps.length;

  const handleNext = () => {
    
    if(activeStep === 0){
      if (!props.auth.allNames.find(otherName => otherName === name)) {
        setNameTaken(false);
      } else {
        setNameTaken(true);
        return;
      }
    }

    if (activeStep === maxSteps - 1) {
      handleCharacterCreationFinish(name, sex, characterClass, attributes);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  
  return (
    <div style={{width: '100vw', height: `calc(100vh - ${props.fullHeightCorrection}px)`}}>
      <Dialog
        fullScreen
        open={!props.auth.profile.name || !props.auth.profile.class}
        onClose={handleCharacterCreationFinish}
      >
        <div className={classes.root}>
          <Container
            className={classes.container}
            style={{
              minHeight: `calc(100vh - ${stepperRef.current ? stepperRef.current.clientHeight: '0'}px)`,
            }}
          >
          <div className={classes.paper}>

            {characterCreationError && 
              <Typography  color="secondary" style={{textAlign: 'center', marginBottom:'2rem'}}>Błąd finalizacji tworzenia postaci. Sprawdź poprawność danych i spróbuj jeszcze raz.</Typography>
            }
            {steps[activeStep]}
          </div>
          </Container>
          <MobileStepper
            ref={stepperRef}
            //id="stepper"
            steps={maxSteps}
            position="static"
            variant="dots"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={nextDisabled}
                variant="contained"
                color="primary"
              >
                {activeStep === maxSteps - 1 ? "Stwórz postać" : "Dalej"}
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
                style={{ opacity: activeStep === 0 ? "0" : "1" }}
              >
                Wróć
              </Button>
            }
          />
        </div>
      </Dialog>
    </div> 
    
  );
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    fullHeightCorrection: state.layout.navbarHeight + state.layout.footerHeight,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCreateCharacter: (name, sex, charClass, attributes) => dispatch(createCharacter(name, sex, charClass, attributes)),
    onGetAllNames: () => dispatch(getAllNames()),
    onClearAllNames: ()=> dispatch(clearAllNames()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CharacterCreation);
