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
    width: "80%",
    height: "60%",
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


  const handleNameChange = event => {
    setName(event.target.value.trim());
  };

  const steps = [<Step1 handleChange={handleNameChange} value={name}/>, <Step2 />, <Step3 />, <Step4 />, <Step5 />];

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
      let buttonDisabled = true
    if(name.length > 1){
        buttonDisabled = false
    }
    setNextDisabled(buttonDisabled)
  }, [name])


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
          <Button size="small" onClick={handleNext} disabled={nextDisabled}>
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
