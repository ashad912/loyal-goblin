import React from "react";
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
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import styled from 'styled-components'
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from '@material-ui/icons/Delete';


const AddIcon = styled(AddCircleIcon)`
  color: #3f51b5
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

const perkTypes = [
  "attr-strength",
  "attr-dexterity",
  "attr-magic",
  "attr-endurance",
  "experience",
  "disc-product",
  "disc-category",
  "disc-rent",
  "custom"
];

const StyledBox = styled(Box)`
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    margin: 0.5rem 0 0.5rem 0;
`

const createTempProducts = () => {
  return [{
    _id: 1,
    category: "shot",
    name: "Wóda",
    description: "nie mam weny",
    price: 7.0,
    imgSrc: "drink.png"
  },
  {
    _id: 2,
    category: "shot",
    name: "Zryje",
    description: "na opisy",
    price: 7.0,
    imgSrc: "drink.png"
  },
  {
    _id: 3,
    category: "shot",
    name: "Banie",
    description: "szotów",
    price: 7.0,
    imgSrc: "drink.png"
  },
  {
    _id: 4,
    category: "shot",
    name: "BWóda",
    description: "nie mam weny",
    price: 7.0,
    imgSrc: "drink.png"
  },
  {
    _id: 5,
    category: "shot",
    name: "BZryje",
    description: "na opisy",
    price: 7.0,
    imgSrc: "drink.png"
  }]
}

const productCategories = ['shots', 'drinks', 'beer', 'food', 'alco-free']

const rentRooms = ['medieval', 'post-apo', 'sci-fi']

const days = [null, 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela']

class PerkModal extends React.Component {

  state = {
    perk:{
      perkType: undefined,
      value: undefined,
      target: undefined,
      time: [/* hoursFlag, day, startHour, lengthInHours*/],
    },
    formError: {
      value: undefined
    },
    timeActive: false,
    products: createTempProducts(),
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
      if(perk.perkType === undefined){
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
          
          let newTargetValue = undefined
          switch(fieldValue) {
            case targetPerks[0]:
              newTargetValue = this.state.products[0]
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
              target: newTargetValue,
              value: clearValue ? '' : this.state.perk.value
              
            },
            formError: {
              ...this.state.formError,
              value: clearValue ? undefined : this.state.formError.value
            },
          })
        }else{
          this.setState({
            perk: {
              ...this.state.perk,
              target: undefined,
              value: clearValue ? '' : this.state.perk.value
            },
            formError: {
              ...this.state.formError,
              value: clearValue ? undefined : this.state.formError.value
            },
          })
        }
        break
      case 'value':
        let valueValid = true
        let valueError = ''

        if(fieldValue.length > 0 && this.state.perk.perkType !== 'custom'){
          valueValid = fieldValue.trim().match(/^[-+]?[0-9]*%?$/);
          valueError = valueValid ? undefined : 'Niepoprawna wartość!'
        }else{
          valueValid = true
          valueError = undefined
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
        perkType: undefined,
        value: undefined,
        target: undefined,
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
    
    this.setState({
      // perk:{
      //   perkType: undefined,
      //   value: undefined,
      //   target: undefined,
      //   time: [/*day, startHour, lengthInHours*/],
      // }
    }, () => {
      this.props.updatePerks(perk)
    })
    
  }


  render(){
/*
    const createMakeList = (perkType) => {
      console.log('createHalo')
      switch(perkType){
        case 'disc-product':
          const products = this.state.products
          console.log(this.state.products)
          products.map((product) => {
            return(
              <MenuItem value={product.name}>{product.name}</MenuItem>
            )
          })
        break
        case 'disc-category':
          const categories = this.state.categories
          categories.map((category) => {
            return(
              <MenuItem value={category}>{category}</MenuItem>
            )
          })
        case 'disc-rent':
          const rentRooms = this.state.rentRooms
          rentRooms.map((room) => {
            return(
              <MenuItem value={room}>{room}</MenuItem>
            )
          })
        default:
          break
      }
    }
     <FormControl >
                    <InputLabel htmlFor="target">Zakres zniżki</InputLabel>
                    <Select
                        value={this.state.perk.target}
                        onChange={this.handleChangeNameValue}
                        inputProps={{
                            name: 'target',
                            id: 'target',
                        }}
                    >
                    {createMakeList(this.state.perk.perkType)} 
                    </Select>
              </FormControl> 
*/

const createDiscTarget = (perkType) => {
  switch(perkType){
    case 'disc-product':
      return(
        
      <StyledFormControl >
            <InputLabel shrink={true} htmlFor="target">Zakres zniżki</InputLabel>
            <Select
                value={this.state.perk.target}
                onChange={this.handleChangePerkNameValue}
                inputProps={{
                    name: 'target',
                    id: 'target',
                }}
            >
            {this.state.products.map((product) => {
              return(
                <MenuItem value={product}>{product.name}</MenuItem>
              )
            })}
            </Select>
      </StyledFormControl>
      )
    break
    case 'disc-category':
      return(
        <StyledFormControl >
          <InputLabel shrink={true} htmlFor="target">Zakres zniżki</InputLabel>
          <Select
              value={this.state.perk.target}
              onChange={this.handleChangePerkNameValue}
              inputProps={{
                  name: 'target',
                  id: 'target',
              }}
          >
          {this.state.categories.map((category) => {
            return(
              <MenuItem value={category}>{category}</MenuItem>
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
              value={this.state.perk.target}
              onChange={this.handleChangePerkNameValue}
              
              inputProps={{
                  name: 'target',
                  id: 'target',
              }}
          >
          {this.state.rentRooms.map((room) => {
            return(
              <MenuItem value={room}>{room}</MenuItem>
            )
          })}
          </Select>
        </StyledFormControl>
      )
    default:
      break
  }
}
const getEndHour = (startHour, length) => {
  return (startHour + length) % 24
}

const createNumberList = (startNum, endNum, isWeekDay, isHour, startHour) => {
  let numArray=[];
  for(let i=startNum; i < endNum+1; i++) {
    numArray=[...numArray, i]
  }
  return numArray.map((num)=>{
    return(
      <MenuItem value={num}>{isWeekDay ? (days[num]): (isHour ? (`${num}:00`) : (`${num} (${getEndHour(startHour, num)}:00)`))}</MenuItem>
    )
  })
  
}

const convertToPerkLabel = (perkType) => {
  const perkObjects = [
    {
      perk: 'attr-strength',
      label: 'Atrybut: Siła'
    },
    {
      perk: 'attr-dexterity',
      label: 'Atrybut: Zręczność',
    },
    {
      perk: 'attr-magic',
      label: 'Atrybut: Magia'
    },
    {
      perk: 'attr-endurance',
      label: 'Atrybut: Wytrzymałość'
    },
    {
      perk: 'experience',
      label: 'Doświadczenie',
    },
    {
      perk: 'disc-product',
      label: 'Zniżka: Produkt',
    },
    {
      perk: 'disc-category',
      label: 'Zniżka: Kategoria produktów'
    },
    {
      perk: 'disc-rent',
      label: 'Zniżka: Rezerwacja pokoi'
    },
    {
      perk: 'custom',
      label: 'Własny'
    }
  ]

  const index = perkObjects.findIndex((perkObject) => {return perkObject.perk === perkType})

  if(index !== -1){
    return perkObjects[index].label
  }
  return null
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
                          <MenuItem value={perkType}>{convertToPerkLabel(perkType)}</MenuItem>
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
                helperText={this.state.formError.value ? (this.state.formError.value) : ("Procenty lub wartości bezwzględne (całkowite): 10%, -5%, +1, -50")}
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
          <Button onClick={this.handleClose} color="primary">
            Anuluj
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
};
}

export default PerkModal;
