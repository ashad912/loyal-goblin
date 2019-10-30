import React, { Component } from "react";
import moment from "moment";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Slider from "@material-ui/core/Slider";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import List from "@material-ui/core/List";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import PerkListBox from './PerkListBox'

import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import PerkModal from "./PerkModal";
import {asyncForEach} from '../../../utils/methods'
import {classLabels, itemTypeLabels} from '../../../utils/labels'
import {torpedoFields, userClasses, itemModelTypes} from '../../../utils/modelArrays'




const FileInputWrapper = styled.div`
  position: relative;
  background: red;
  height: 2.5rem;
  width: 10rem;
  margin: 1rem 0 1.3rem 0;
`;

const HiddenFileInput = styled(Input)`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  height: 2.5rem;
  width: 10rem;
  user-select: none;
`;

const FileInputButton = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  height: 2.5rem;
  width: 10rem;
`;

const AddIcon = styled(AddCircleIcon)`
  color: #3f51b5
  width: 1.5rem;
  transition: transform 0.2s ease-in-out;
  transform: scale(1.8);
  &:active {
    transform: scale(1.5);
  }
`;


const validatedFields = ['type', 'name', 'description', 'icon']


            
class NewItemCreator extends Component {
  state = {
    name: '',
    description: '',
    icon: "",
    class: null,
    modifyingIndex: null,
    showPerkModal: false,
    perks: [],
    formError: {
      name: null,
      description: null,
      icon: null
    }
  };

  componentDidMount = () => {
      const item = this.props.item
      
      console.log(item)
      this.setState({
        _id: item._id,
        name: item.name,
        description: item.description,
        type: item.type ? (item.type) : (Object.keys(itemTypeLabels)[0]),
        class: item.class,
        perks: item.perks,
        icon: item.imgSrc ? ((item.imgSrc.includes('blob') || item.imgSrc.includes('data:image')) ? (item.imgSrc) : (require("../../../assets/icons/items/" + item.imgSrc))) : (null),
        twoHanded: item.twoHanded
      }, () => {
        this.setState({
          componentMounted: true
        })
      })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(this.state.componentMounted){
      let torpedo = 'torpedo'
      if((prevState.type === torpedo && this.state.type !== torpedo)){
        this.setState({
          name: '',
          class: null
        })
      }
      if((prevState.type !== torpedo && this.state.type === torpedo)){
        this.setState({
          name: torpedoFields[0],
          class: null
        })
      }

      let weapon = 'weapon'
      if((prevState.type === weapon && this.state.type !== weapon)){
        this.setState({
          twoHanded: undefined
        })
      }
      if((prevState.type !== weapon && this.state.type === weapon)){
        this.setState({
          twoHanded: false
        })
      }
    }
  }
 
  handleAddPerk = () => {
    this.setState({
      perkToModal: {
        perkType: null,
        value: null,
        target: null,
        time: [/*hoursFlag, day, startHour, lengthInHours*/],
      }
    }, () => {
      this.handleTogglePerkModal()
    })
  }

  handleModifyPerk = (index) => {
    console.log(this.state.perks[index])
    this.setState({
      perkToModal: this.state.perks[index],
      modifyingIndex: index
    }, () => {
      this.handleTogglePerkModal()
    })

  }

  handleDeletePerk = (index) => {
    const perks = this.state.perks.filter((perk, perkIndex) => {
      return perkIndex !== index
    })
    this.setState({
      perks: perks
    })
    
  }
  handleTogglePerkModal = e => {
    this.setState(prevState => {
      return { 
        showPerkModal: !prevState.showPerkModal,
        modifyingIndex: prevState.showPerkModal ? null : prevState.modifyingIndex
       };
    });
  };

  handleIconChange = e => {
    const url = URL.createObjectURL(e.target.files[0])
    this.setState({ icon: url}, () => this.callbacksAndValidation('icon', url));
  };

  handleToggleClassItem = e => {
    
    this.setState(prevState => {
      return { classItem: !prevState.classItem,
                class: prevState.class ? null : userClasses[0]
             };
    });
  };

  handleToggleWeaponHanded = e => {
    
    this.setState(prevState => {
      return { twoHanded: prevState.twoHanded ? false : true
             };
    });
  };

  handleChangeNameValue = (e) => {
    
    const name = e.target.name
    const value = e.target.value 
    
    this.setState({
        [name]: value
    }, () => {
      
        this.callbacksAndValidation(name, value)
      
    })
  };

  handleSubmit = () => {
    //valdidate and send data
    this.props.handleClose();
  };

 
  updatePerks = (perk) => {
    
    if(this.state.modifyingIndex != null){
      const perks = this.state.perks

      perks[this.state.modifyingIndex] = perk

   
      this.setState({
        perks: perks,
      }, () => {
        console.log(this.state.perks)
        this.handleTogglePerkModal()
      })
    }else{
      this.setState({
        perks: [...this.state.perks, perk]
      }, () => {
        this.handleTogglePerkModal()
      })
    }
    
  }

  callbacksAndValidation = (fieldName, fieldValue, prevFieldValue) => {
    
    if(validatedFields.includes(fieldName)){
      let error = ''

        if(fieldValue.length === 0){
          error = fieldName === 'icon' ? ('Ikona wymagana!') : ('Pole wymagane!')
        }

        this.setState({
          formError: {
              ...this.state.formError,
              [fieldName]: error
          },
          
        });
    }
        
  }

  saveItem = async () => {
      

      await asyncForEach(validatedFields, (fieldName) => {
        if(!this.state[fieldName] || !this.state[fieldName].length){
          console.log('halo', fieldName)
          this.setState({
            formError: {
                ...this.state.formError,
                [fieldName]: fieldName === 'icon' ? ('Ikona wymagana!') : ('Pole wymagane!')
            },
            
          });
        }
      })

      let breakFlag = false
      Object.keys(this.state.formError).forEach((targetKey)=>{
        if(this.state.formError[targetKey]){
          breakFlag = true
          return
        }
      })
  
      if(breakFlag){
        return
      }
  

      const item = {
        _id: this.state._id,
        name: this.state.name,
        description: this.state.description,
        type: this.state.type,
        class: this.state.class,
        perks: this.state.perks,
        imgSrc: this.state.icon,
        twoHanded: this.state.twoHanded
      }
      if(item.twoHanded === undefined){
        delete item.twoHanded
      }

      this.props.updateItems(item)
  }

 

  render() {

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Button onClick={this.props.handleClose}>{"< Powrót do panelu przedmiotów"}</Button>
        <Container>
          <Grid container spacing={5} style={{marginTop: '1rem'}}>
          <Grid item xs={6} style={{textAlign: 'left'}}>
            <FormControl style={{minWidth: '10rem'}}>
                <InputLabel shrink={true} htmlFor="type">Typ przedmiotu</InputLabel>
                <Select
                    autoFocus
                    value={this.state.type}
                    onChange={this.handleChangeNameValue}
                    inputProps={{
                        name: 'type',
                        id: 'type',
                    }}
                >
                    {Object.keys(itemTypeLabels).map((itemTypeKey) => {
                        return(
                            <MenuItem value={itemTypeKey}>{itemTypeLabels[itemTypeKey]}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
            </Grid>
            <Grid item xs={1}>
            </Grid>
            <Grid item xs={5} style={{textAlign: 'left'}}>
            {this.state.type === 'weapon' && 
              <div style={{display: 'flex'}}>
                <Typography component="div" style={{width: 'auto'}}>
                <Typography style={{textAlign: 'left', color: 'rgba(0, 0, 0, 0.54)', fontSize: '0.75rem'}}>Rodzaj broni</Typography>
                
                    <Grid component="label" container alignItems="center" spacing={1} >
                    <Grid item>Jednoręczna</Grid>
                    <Grid item>
                    <FormControl >
                        <Switch
                            checked={this.state.twoHanded}
                            onChange={this.handleToggleWeaponHanded}
                        />
                        </FormControl>
                    </Grid>
                    <Grid item>Dwuręczna</Grid>
                    
                    </Grid>
                    
                
                    
                </Typography>
                
              </div>}
            </Grid>
          <Grid item xs={6} >
            {this.state.type !== 'torpedo' ? (
              <TextField
                value={this.state.name}
                name="name"
                margin="dense"
                label={`Nazwa przedmiotu`}
                type="text"
                fullWidth
                onChange={this.handleChangeNameValue}
                error={this.state.formError.name ? true : false}
                helperText={this.state.formError.name ? (this.state.formError.name) : (null)}
               />
            ) : (
              <FormControl style={{width: '100%', textAlign: 'left'}}>
                <InputLabel shrink={true} htmlFor="type">Nazwa przedmiotu</InputLabel>
                <Select
                    autoFocus
                    value={this.state.name}
                    onChange={this.handleChangeNameValue}
                    inputProps={{
                        name: 'name',
                        id: 'name',
                    }}
                >
                    {torpedoFields.map((torpedo) => {
                        return(
                            <MenuItem value={torpedo}>{torpedo}</MenuItem>
                        )
                    })}
                </Select>
              </FormControl>
            )}
            
            <TextField
              value={this.state.description}
              name="description"
              margin="dense"
              label={`Opis przedmiotu`}
              type="text"
              fullWidth
              multiline
              rows={2}
              rowsMax={5}
              onChange={this.handleChangeNameValue}
              error={this.state.formError.description ? true : false}
              helperText={this.state.formError.description ? (this.state.formError.description) : (null)}
            />
          </Grid>
          <Grid item xs={1} >
          </Grid>
          <Grid item xs={5} >
          <Grid container spacing={2}>
            <Grid item>
              <FileInputWrapper>
                <FileInputButton variant="contained" color="primary">
                  {this.state.icon ? "Zmień ikonę" : "Dodaj ikonę"}
                </FileInputButton>
                <HiddenFileInput
                  type="file"
                  accept="image/*"
                  onChange={this.handleIconChange}
                />
                
              </FileInputWrapper>
              {this.state.formError.icon && <Typography style={{color: 'red', fontSize: '0.8rem'}}>{this.state.formError.icon}</Typography>}
            </Grid>
            <Grid
              item
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <img src={this.state.icon} style={{ width: "64px" }} />
            </Grid>
          </Grid>
          
          {this.state.type !== 'torpedo' && 
          <div style={{display: 'flex'}}>
            <Typography component="div" style={{width: 'auto'}}>
            <Typography style={{textAlign: 'left', color: 'rgba(0, 0, 0, 0.54)', marginTop: '0.5rem', fontSize: '0.75rem'}}>Przeznaczenie</Typography>
            
                <Grid component="label" container alignItems="center" spacing={1} >
                <Grid item>Ogólne</Grid>
                <Grid item>
                <FormControl >
                    <Switch
                        checked={this.state.classItem}
                        onChange={this.handleToggleClassItem}
                    />
                    </FormControl>
                </Grid>
                <Grid item>Klasowe</Grid>
                
                </Grid>
                
             
                
            </Typography>
            
            {this.state.classItem ? (
                    <FormControl style={{ marginTop: '0.5rem', marginLeft: '2rem'}}>
                        <InputLabel  htmlFor="class">Klasa</InputLabel>
                        <Select
                            style={{marginTop: '1.3rem'}}
                            value={this.state.class}
                            onChange={this.handleChangeNameValue}
                            inputProps={{
                                name: 'class',
                                id: 'class',
                            }}
                        >
                            {userClasses.map((userClass) => {
                                return (
                                    <MenuItem value={userClass}>{classLabels[userClass]}</MenuItem>
                                )
                            })}
                        </Select>
                  </FormControl>
                ) : (
                    null
                )}
            
          </div>}
          </Grid>
          </Grid>
          <Grid container spacing={2} style={{marginTop: '1.5rem'}}>
           <Grid item xs={12} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          
            <Typography variant="h6">Efekty przedmiotu</Typography>
            <AddIcon
                style={{marginRight: '0.5rem'}}
                onClick={this.handleAddPerk}
            />
            </Grid>
            
          {this.state.perks && this.state.perks.length ? (
              <PerkListBox
                perks={this.state.perks}
                headers={true}
                typeWidth={3}
                valueWidth={2}
                targetWidth={1}
                timeWidth={3}
                breakWidth={1}
                actions={true}
                buttonsWidth={2}
                handleDeletePerk={this.handleDeletePerk}
                handleModifyPerk={this.handleModifyPerk}
              />   
            ):(
                null
            )
          }
          </Grid>
          <Grid
            container
            justify="center"
            spacing={5}
            style={{ marginTop: "1rem" }}
          >
            <Grid item>
              <Button onClick={this.props.handleClose} color="secondary">
                Anuluj
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={this.saveItem}
                color="primary"
                variant="contained"
              >
                Zatwierdź
              </Button>
            </Grid>
          </Grid>
          
        
          <PerkModal
            open={this.state.showPerkModal}
            handleClose={this.handleTogglePerkModal}
            updatePerks={this.updatePerks}
            trigger={this.state.showPerkModal}
            perkToModal={this.state.perkToModal}
          />
      
        </Container>
      </MuiPickersUtilsProvider>
    );
  }
}

export default NewItemCreator;
