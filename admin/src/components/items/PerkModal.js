import React from "react";
import styled from 'styled-components'
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from '@material-ui/icons/Delete';

import {perkLabels, dayLabels, categoryLabels, roomLabels} from '../../utils/labels'
import {rentRooms, productCategories, perkTypes} from '../../utils/modelArrays'

const AddIcon = styled(AddCircleIcon)`
  width: 1.5rem;
  transition: transform 0.2s ease-in-out;
  transform: scale(1.8);
  &:active {
    transform: scale(1.5);
  }
`;

const StyledFormControl = styled(FormControl)`
  min-width: 10rem;
`


const StyledBox = styled(Box)`
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    margin: 0.5rem 0 0.5rem 0;
`

const nullTarget = {
  'disc-product': null,
  'disc-category': null,
  'disc-rent': null
}

const setTarget = (object, field, value) => { 
  Object.keys(object).forEach((key) => key === field ? object[key] = value : object[key] = null)
  return object
}


class PerkModal extends React.Component {

  state = {
    perk:{
      perkType: null,
      value: null,
      target: {...nullTarget},
      time: [/* hoursFlag, day, startHour, lengthInHours*/],
    },
    formError: {
      value: null
    },
    timeActive: false,
    categories: productCategories,
    rentRooms: rentRooms
    
  }

  componentDidMount = () => {
    
  }

  componentDidUpdate = (prevProps) => {
    

    if(!prevProps.trigger && this.props.trigger){
      const perk = this.props.perkToModal
      let timeActive = null;
      if(this.props.perkToModal.time.length){
        timeActive = true
      }else{
        timeActive = false
      }
      if(perk.perkType === null){
        perk.perkType = perkTypes[0]
      }
      console.log(this.props.perkToModal)
      this.setState({
        perk: this.props.perkToModal,
        timeActive: timeActive
      })
    }
  }

  handleChangePerkNameValue = (e) => {
    const name = e.target.name
    const value = e.target.value
    let prevValue = null 
    
    this.setState((prevState) => {
      prevValue = prevState.perk[name]
      return{
        perk: {
          ...this.state.perk,
          [name]: value
        } 
      }    
    }, () => {
      this.callbacksAndValidation(name, value, prevValue)
    })
  };

  handleChangePerkTargetNameValue = (e) => {
    const name = e.target.name
    const value = e.target.value
    let prevValue = null 
    
    this.setState((prevState) => {
      prevValue = prevState.perk[name]
      return{
        perk: {
          ...this.state.perk,
          target: {
            ...this.state.perk.target,
            [name]: value
          }
          
        } 
      }    
    }, () => {
      this.callbacksAndValidation(name, value, prevValue)
    })
  };

  handleChangePerkTimeNameValue = (e, index) => {
    const name = e.target.name
    const value = e.target.value 

    const time = this.state.perk.time;
    time[index][name] = value

    this.setState({
      perk:{
        ...this.state.perk,
        time: time   
      }     
    })
  };

  callbacksAndValidation = (fieldName, fieldValue, prevFieldValue) => {
    
    switch(fieldName) {
      case 'perkType':
        let clearValue = false
        if(prevFieldValue === 'custom' || fieldValue === 'custom'){
          clearValue = true
        }
        const targetPerks = ['disc-product', 'disc-category', 'disc-rent']
        if(targetPerks.includes(fieldValue)){
          
          let newTargetValue
          switch(fieldValue) {
            case targetPerks[0]:
              newTargetValue = this.props.products[0]
              break
            case targetPerks[1]:
              newTargetValue = this.state.categories[0]
              break
            case targetPerks[2]:
              newTargetValue = this.state.rentRooms[0]
              break
            default:
              break
          }
          this.setState({
            perk: {
              ...this.state.perk,
              target: setTarget(this.state.perk.target, fieldValue, newTargetValue),
              value: clearValue ? '' : this.state.perk.value
              
            },
            formError: {
              ...this.state.formError,
              value: clearValue ? null : this.state.formError.value
            },
          })
        }else{
          
          this.setState({
            perk: {
              ...this.state.perk,
              target: {...nullTarget},
              value: clearValue ? '' : this.state.perk.value
            },
            formError: {
              ...this.state.formError,
              value: clearValue ? null : this.state.formError.value
            },
          })
        }
        break
      case 'value':
        let valueValid = true
        let valueError = ''

        if(fieldValue.length > 0 && this.state.perk.perkType !== 'custom'){
          valueValid = fieldValue.trim().match(/^[-+]?[0-9]*%?$/);
          valueError = valueValid ? null : 'Niepoprawna wartość!'
        }else{
          valueValid = true
          valueError = null
        }
        this.setState({
          formError: {
              ...this.state.formError,
              value: valueError
          },
          
        });
        break
      default:
        break
    }


  }

  handleClose = () => {
    this.setState({
      perk:{
        perkType: null,
        value: null,
        target: {...nullTarget},
        time: [/*day, startHour, lengthInHours*/],
      }
    }, () => {
      this.props.handleClose()
    })
  }

  handleTogglePerkTimeSetting = (e) => {
    
    this.setState(prevState => {
      return { 
        timeActive: !prevState.timeActive,
        perk: {
          ...this.state.perk,
          time: !prevState.timeActive && !prevState.perk.time.length ? [{hoursFlag: false, startDay: 1, startHour: 12, lengthInHours: 24}] : prevState.perk.time
        }
      };
    });
  }

  handleTogglePerkTimeHoursForPeriod = (index) => {

    this.setState(prevState => {
      const time = prevState.perk.time

      if(time[index].hoursFlag){
        time[index].startHour = 12
        time[index].lengthInHours = 24
      }else{
        time[index].startHour = 16
        time[index].lengthInHours = 3
      }

      time[index].hoursFlag = !time[index].hoursFlag
      

      return {
        perk: {
          ...this.state.perk,
          time: time
        }
        
      }
    })
  }

  handleAddTimePeriod = () => {
    
    const newPeriod = {hoursFlag: false, startDay: 1, startHour: 12, lengthInHours: 24}
    
    this.setState({
      perk: {
        ...this.state.perk,
        time: [newPeriod, ...this.state.perk.time]
      }
    })
  }

  handleDeleteTimePeriod = (index) => {
    console.log(index)
    const time = this.state.perk.time.filter((period, periodIndex)=> {
      return periodIndex !== index
    })
    console.log(time)
    
    this.setState({
      perk: {
        ...this.state.perk,
        time: time
      },
    })
  }

  handleUpdatePerk = () => {
    const perk = this.state.perk
    if(!perk.value || !perk.value.length){
      this.setState({
        formError: {
            ...this.state.formError,
            value: 'Pole wymagane!'
        },
      });

      return
    }
    if(!this.state.timeActive){
      perk.time = []
    }

    //prevent minus discount
    if(perk.perkType.includes('disc') && (perk.value.includes('-') || perk.value.includes('+'))){
      perk.value = perk.value.slice(1)
    }

    this.props.updatePerks(perk)

    // this.setState({
    //   // perk:{
    //   //   perkType: null,
    //   //   value: null,
    //   //   target: null,
    //   //   time: [/*day, startHour, lengthInHours*/],
    //   // }
    // }, () => {
      
    // })
    
  }


render(){


const createDiscTarget = (perkType) => {
  switch(perkType){
    case 'disc-product':
      return( 
        <StyledFormControl >
              <InputLabel shrink={true} htmlFor="target">Zakres zniżki</InputLabel>
              <Select
                  value={this.state.perk.target['disc-product']}
                  onChange={this.handleChangePerkTargetNameValue}
                  inputProps={{
                      name: 'disc-product',
                      id: 'disc-product',
                  }}
              >
              {this.props.products.map((product) => {
                return(
                  <MenuItem value={product}>{product.name}</MenuItem>
                )
              })}
              </Select>
        </StyledFormControl>
      )
    case 'disc-category':
      return(
        <StyledFormControl >
          <InputLabel shrink={true} htmlFor="target">Zakres zniżki</InputLabel>
          <Select
              value={this.state.perk.target['disc-category']}
              onChange={this.handleChangePerkTargetNameValue}
              inputProps={{
                  name: 'disc-category',
                  id: 'disc-category',
              }}
          >
          {this.state.categories.map((category) => {
            return(
              <MenuItem value={category}>{categoryLabels[category]}</MenuItem>
            )
          })}
          </Select>
        </StyledFormControl>
      )
    case 'disc-rent':
      return(
        <StyledFormControl >
          <InputLabel shrink={true} htmlFor="target" >Zakres zniżki</InputLabel>
          <Select
              value={this.state.perk.target['disc-rent']}
              onChange={this.handleChangePerkTargetNameValue}
              
              inputProps={{
                  name: 'disc-rent',
                  id: 'disc-rent',
              }}
          >
          {this.state.rentRooms.map((room) => {
            return(
              <MenuItem value={room}>{roomLabels[room]}</MenuItem>
            )
          })}
          </Select>
        </StyledFormControl>
      )
    default:
      break
  }
}


const createNumberList = (startNum, endNum, isWeekDay, isHour, startHour) => {
  let numArray=[];
  for(let i=startNum; i < endNum+1; i++) {
    numArray=[...numArray, i]
  }
  return numArray.map((num)=>{
    return(
      <MenuItem value={num}>{isWeekDay ? (dayLabels[num]): (isHour ? (`${num}:00`) : (`${num} (${(startHour + num) % 24}:00)`))}</MenuItem>
    )
  })
  
}


  return (
    <div>
    
      <Dialog
        open={this.props.open}
        onClose={this.handleClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Efekt przedmiotu</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item>
            <StyledFormControl >
              <InputLabel htmlFor="perkType">Typ</InputLabel>
              <Select
                  style={{marginTop: '0.85rem', minWidth: '3rem'}}
                  autoFocus
                  value={this.state.perk.perkType}
                  onChange={this.handleChangePerkNameValue}
                  inputProps={{
                      name: 'perkType',
                      id: 'perkType',
                  }}
              >
                  {perkTypes.map((perkType) => {
                      return (
                          <MenuItem value={perkType}>{perkLabels[perkType]}</MenuItem>
                      )
                  })}
              </Select>
            </StyledFormControl>
            </Grid>
          {this.state.perk.perkType && this.state.perk.perkType !== 'custom' ? (
            <React.Fragment>
            <Grid item>
              <TextField
                style={{margin: '0 0 0 0', minWidth: '23rem'}}
                value={this.state.perk.value}
                error={this.state.formError.value}
                name="value"
                margin="dense"
                label={`Modyfikator efektu`}
                type="text"
                helperText={this.state.formError.value ? (this.state.formError.value) : ("Procenty lub wartości bezwzględne (całkowite): 10%, -5%, -1, +5")}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={this.handleChangePerkNameValue}
              />
            </Grid>
            {this.state.perk.perkType.includes("disc") ? ( 
              <Grid item>
                {createDiscTarget(this.state.perk.perkType)}
              </Grid>
            ) : (null)}
            </React.Fragment>
          ) : (
            <Grid item xs={9}>
              {this.state.perk.perkType === 'custom' ? (
                <TextField
                  style={{margin: '0.1rem 0 0 0'}}
                  value={this.state.perk.value}
                  fullWidth
                  name="value"
                  margin="dense"
                  label={`Opis efektu działania`}
                  type="text"
                  error={this.state.formError.value}
                  helperText={this.state.formError.value ? (this.state.formError.value) : (null)}
                  multiline
                  rows={1}
                  rowsMax={5}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={this.handleChangePerkNameValue}
                />
              ) : (null)}
              </Grid>
          )}
          
          </Grid>

          <Grid container justify="flex-start" alignItems='center'>
          <Grid item>
            <Grid component="label" container alignItems="center" spacing={1} style={{marginTop: '1rem'}}>
            
              <Grid item><Typography>Efekt stały</Typography></Grid>
              <Grid item>
                  <Switch
                      name='active'
                      checked={this.state.timeActive}
                      onChange={this.handleTogglePerkTimeSetting}
                  />
              </Grid>
              <Grid item><Typography>Efekt czasowy</Typography></Grid>
            
            
            
            </Grid>
          </Grid>
          {this.state.timeActive ? (
              <Grid item >
                <AddIcon
                  style={{marginLeft: '2.5rem', marginTop: '1.5rem'}}
                  color='primary'
                  onClick={this.handleAddTimePeriod}
                />
              </Grid>
          ) : (null)}
          </Grid>

          
          {this.state.timeActive ? ( 
            <React.Fragment>
              {this.state.perk.time.map((period, index) => {
                return(
                <StyledBox border={1} borderColor="primary.main">
                <Grid container >
                <Grid item xs={6} style={{padding: '0.5rem'}}>
                  <FormControl fullWidth>
                        <InputLabel htmlFor="target">Dzień cyklicznej aktywacji efektu</InputLabel>
                        <Select
                            
                            value={period.startDay}
                            onChange={(e) => this.handleChangePerkTimeNameValue(e, index)}
                            inputProps={{
                                name: 'startDay',
                                id: 'startDay',
                            }}
                        >
                        {createNumberList(1, 7, true)}
                        </Select>
                  </FormControl>
                  <FormControlLabel
                      control={
                        <Checkbox
                          name='hours'
                          checked={period.hoursFlag}
                          onChange={() => this.handleTogglePerkTimeHoursForPeriod(index)}
                        />
                      }
                      label="Precyzuj godziny działania"
                  />

                </Grid>
                {period.hoursFlag ? ( 
                  
                  <Grid item xs={4} style={{padding: '0.5rem'}}>
                  <FormControl fullWidth>
                        <InputLabel htmlFor="target">Godzina cyklicznej aktywacji efektu</InputLabel>
                        <Select
                            value={period.startHour}
                            onChange={(e) => this.handleChangePerkTimeNameValue(e, index)}
                            inputProps={{
                                name: 'startHour',
                                id: 'startHour',
                            }}
                        >
                        {createNumberList(0, 23, false, true)}
                        </Select>
                  </FormControl>
                  <FormControl fullWidth style={{marginTop: '0.5rem'}}>
                        <InputLabel htmlFor="target">Długość cyklicznego trwania efektu [h]</InputLabel>
                        <Select
                            value={period.lengthInHours}
                            onChange={(e) => this.handleChangePerkTimeNameValue(e, index)}
                            inputProps={{
                                name: 'lengthInHours',
                                id: 'lengthInHours',
                            }}
                        >
                        {createNumberList(1, 24, false, false, period.startHour)}
                        </Select>
                  </FormControl>
                  </Grid>
                  
                ) : (<Grid item xs={4} style={{padding: '0.5rem'}}></Grid>)}
                {this.state.perk.time.length > 1 ? (
                  <Grid item xs={2} style={{padding: '0.5rem', height: '50%', display: 'flex', justifyContent: 'flex-end'}}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => this.handleDeleteTimePeriod(index)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Grid>
                ) : (null)}
                
                </Grid>
                </StyledBox>
              )})}
            </React.Fragment>
          ):(null)}
          
          
            
          
        </DialogContent>
        <DialogActions>
        <Button onClick={this.handleUpdatePerk} color="primary">
            Zatwierdź
          </Button>
          <Button onClick={this.handleClose} color="secondary">
            Anuluj
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
};
}

export default PerkModal;
