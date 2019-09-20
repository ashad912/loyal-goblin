import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";

import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Step1 from "./characterCreation/Step1";
import Step2 from "./characterCreation/Step2";
import Step3 from "./characterCreation/Step3";
import Step4 from "./characterCreation/Step4";
import Step5 from "./characterCreation/Step5";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    display: "flex",
    height: "80vh",
    justifyContent: "center",
    alignItems: "center"
  },
  paper: {
    width: "90%",
    height: "70%",
    padding: "0.5rem",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"
  }
}));

const CharacterCreation = props => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [nextDisabled, setNextDisabled] = React.useState(true);
  const [name, setName] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [characterClass, setCharacterClass] = React.useState('')
  const [attributePool, setAttributePool] = React.useState(3);
  const [attributes, setAttributes] = React.useState({
    str: 1,
    dex: 1,
    mag: 1,
    end: 1
  });

  const handleNameChange = event => {
    if (/^([a-zA-Z]+)$/.test(event.target.value)) {
      setName(event.target.value.trim());
    }
  };

  const handleGenderChange = event => {
    setGender(event.target.value);
  };



  const handleCharacterClassChange = (event) => {
    setCharacterClass(event.target.value)
  }


  const handleAttributeChange = (event, attributeName, value) => {
    const tempAttributes = { ...attributes };
    if (value > 0 && attributePool <= 0) {
      return;
    }
    if (tempAttributes[attributeName] + value <= 0) {
      return;
    }
    tempAttributes[attributeName] += value;
    setAttributes(tempAttributes);
    setAttributePool(prev => prev - value)
  };

  const steps = [
    <Step1 handleChange={handleNameChange} value={name} />,
    <Step2 handleChange={handleGenderChange} value={gender} />,
    <Step3 handleChange={handleCharacterClassChange} value={characterClass}/>,
    <Step4
      handleChange={handleAttributeChange}
      values={attributes}
      attributePool={attributePool}
    />,
    <Step5 
    name={name}
    gender={gender}
    characterClass={characterClass}
    attributes={attributes}
    />
  ];

  const maxSteps = steps.length;

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      props.onFinish();
    }
   
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  React.useEffect(() => {
    let buttonDisabled = true;
    if (name.length > 1 && activeStep===0) {
      buttonDisabled = false;
    }
    if(gender !== "" && activeStep ===1){
      buttonDisabled = false
    }
    if(characterClass !== "" && activeStep === 2){
      buttonDisabled = false
    }
    if(activeStep === 3 || activeStep === 4){
      buttonDisabled = false
    }
    
    setNextDisabled(buttonDisabled);
  }, [activeStep, name, gender, characterClass]);

  return (
    <div className={classes.root}>
      <Container className={classes.container}>
        <Paper className={classes.paper}>{steps[activeStep]}</Paper>
      </Container>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="dots"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={nextDisabled} variant="contained" color="primary">
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
  );
};

export default CharacterCreation;
