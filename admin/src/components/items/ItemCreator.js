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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
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
import {asyncForEach} from '../../utils/methods'
import { itemsPath, appearancePath } from "../../utils/definitions";
import {classLabels, itemTypeLabels, equippableItems} from '../../utils/labels'
import {torpedoFields, userClasses, itemModelTypes} from '../../utils/modelArrays'
import { createItemModel, updateItemModel, uploadItemModelImages } from "../../store/actions/itemActions";
import { getProducts } from "../../store/actions/productActions";



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
  color: #3f51b5;
  width: 1.5rem;
  transition: transform 0.2s ease-in-out;
  transform: scale(1.8);
  &:active {
    transform: scale(1.5);
  }
`;


const validatedFields = ['type', 'name', 'description', 'iconView', 'appearanceView']

const nullTarget = {
  'disc-product': null,
  'disc-category': null,
  'disc-rent': null
}
            
class ItemCreator extends Component {
  state = {
    name: '',
    description: '',
    icon: "",
    appearance: "",
    iconView: "",
    appearanceView: '',
    loyalAward: false,
    class: 'any',
    modifyingIndex: null,
    showPerkModal: false,
    perks: [],
    products: [],
    formError: {
      name: null,
      description: null,
      iconView: null,
      appearanceView: null,
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
        loyalAward: item.loyalAward ? true : false,
        perks: item.perks,
        iconView: item.imgSrc ? (itemsPath + item.imgSrc) : null, 
        appearanceView: item.appearanceSrc ? (appearancePath + item.appearanceSrc) : null,
        twoHanded: item.twoHanded
      }, () => {
        this.setState({
          componentMounted: true
        })
      })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(this.state.componentMounted){
      
      if(equippableItems.includes(prevState.type) && !equippableItems.includes(this.state.type) ){
        console.log('halo123')
        this.setState({
          appearance: "",
          appearanceView: '',
        }, () => {
          this.setState({
            formError: {
              ...this.state.formError,
              appearanceView: null
            }
          })
        })
      }

      let torpedo = 'torpedo'
      if((prevState.type === torpedo && this.state.type !== torpedo)){
        this.setState({
          name: '',
          class: 'any'
        })
      }
      if((prevState.type !== torpedo && this.state.type === torpedo)){
        this.setState({
          name: torpedoFields[0],
          class: 'any'
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
        target: {...nullTarget},
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
  handleTogglePerkModal = async e => {

    const products = !this.state.showPerkModal && !this.state.products.length ? await getProducts({onlyNames: true}) : []

    this.setState(prevState => {
      return { 
        showPerkModal: !prevState.showPerkModal,
        modifyingIndex: prevState.showPerkModal ? null : prevState.modifyingIndex
       };
    }, () => {
      if(products.length){
        this.setState({
          products: products
        })
      }
    });
  };

  handleIconChange = e => {
    if (e.target.files.length > 0) {
      const url = URL.createObjectURL(e.target.files[0])
      this.setState({ iconView: url, icon: e.target.files[0]}, () => this.callbacksAndValidation('iconView', url));
    }
  };

  handleAppearanceChange = e => {
    if (e.target.files.length > 0) {
      const url = URL.createObjectURL(e.target.files[0])
      this.setState({ appearanceView: url, appearance: e.target.files[0]}, () => this.callbacksAndValidation('appearanceView', url));
    }
  };


  // handleAvatarChange = async e => {
  //   if (e.target.files.length > 0) {
  //       const avatar = e.target.files[0]

  //       const formData = new FormData()
  //       formData.append("avatar", avatar)
  //       e.stopPropagation();
  //       setAnchorEl(null);
  //       //window.location.reload();
  //       await props.updateAvatar(formData); 
        
        
  //   }
//};

  handleToggleLoyalAward = () => {
    this.setState(prevState => {
      return{ loyalAward: !prevState.loyalAward}
    })
  }

  handleToggleClassItem = e => {
    
    this.setState(prevState => {
      return { classItem: !prevState.classItem,
                class: prevState.class !== 'any' ? 'any' : userClasses[0]
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
        error = (fieldName === 'iconView' || fieldName === 'appearanceView') ? ('Obraz wymagany!') : ('Pole wymagane!')
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
        console.log(fieldName)
        if(!this.state[fieldName] || !this.state[fieldName].length){
          if(fieldName !== 'appearanceView' || (fieldName === 'appearanceView' && equippableItems.includes(this.state.type))){
            console.log(fieldName, this.state[fieldName] === 'appearanceView', this.state.type, equippableItems.includes(this.state.type))
            this.setState({
              formError: {
                  ...this.state.formError,
                  [fieldName]: (fieldName === 'iconView' || fieldName === 'appearanceView') ? ('Obraz wymagany!') : ('Pole wymagane!')
              },
              
            });
          }
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
        loyalAward: this.state.loyalAward,
        perks: this.state.perks,
        //icon: this.state.icon,
        //appearance: this.state.appearance,
        twoHanded: this.state.twoHanded
      }
      if(item.twoHanded === undefined){
        delete item.twoHanded
      }

      if(!equippableItems.includes(item.type)){
        delete item.appearance
      } 

      let itemModelId = null
      if(!(typeof this.props.modifyingItemIndex === "number")){
        delete item._id
        itemModelId = await createItemModel(item)
      }else{
        itemModelId = await updateItemModel(item)
      }
      console.log(itemModelId)
      if(itemModelId && (this.state.icon || this.state.appearance)){
        const formData = new FormData()
        if(this.state.icon){
          formData.append('icon', this.state.icon)
        }
        if(this.state.appearance){
          formData.append('appearance', this.state.appearance)
        }
        
        await uploadItemModelImages(itemModelId, formData)
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
            
            {equippableItems.includes(this.state.type) && (
              <Grid item xs={5} >
                <Grid container spacing={2}>
                  <Grid item>
                  <FileInputWrapper>
                    <FileInputButton variant="contained" color="primary">
                      {this.state.appearanceView ? "Zmień wygląd" : "Dodaj wygląd"}
                    </FileInputButton>
                    <HiddenFileInput
                      type="file"
                      onChange={this.handleAppearanceChange}
                      inputProps={{accept:"image/svg+xml"}}
                    />
                    
                  </FileInputWrapper>
                  {this.state.formError.appearanceView && <Typography style={{color: 'red', fontSize: '0.8rem'}}>{this.state.formError.appearanceView}</Typography>}
                </Grid>
                <Grid
                  item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <img src={this.state.appearanceView} style={{ width: "64px" }} />
                </Grid>
              </Grid>
           </Grid>)}

          <Grid item xs={12} style={{paddingTop: '0rem', paddingBottom: '0rem'}}>
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

          <Grid item xs={6} style={{display: 'flex', flexDirection: 'column'}}>
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
            <FormControlLabel
              
              control={
                <Checkbox
                  checked={this.state.loyalAward}
                  onChange={this.handleToggleLoyalAward}
                />
              }
              label="Nagroda lojalnościowa"
            />
          </Grid>
          <Grid item xs={1} >
          </Grid>
          <Grid item xs={5} >
          <Grid container spacing={2}>
            <Grid item>
              <FileInputWrapper>
                <FileInputButton variant="contained" color="primary">
                  {this.state.iconView ? "Zmień ikonę" : "Dodaj ikonę"}
                </FileInputButton>
                <HiddenFileInput
                  type="file"
                  //accept="image/*"
                  onChange={this.handleIconChange}
                  inputProps={{accept: 'image/*'}}
                />
                
              </FileInputWrapper>
              {this.state.formError.iconView && <Typography style={{color: 'red', fontSize: '0.8rem'}}>{this.state.formError.iconView}</Typography>}
            </Grid>
            <Grid
              item
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <img src={this.state.iconView} style={{ width: "64px" }} />
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
          <Grid item style={{ paddingTop: "0rem", paddingBottom: '0rem' }}>
            
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
            products={this.state.products}
          />
      
        </Container>
      </MuiPickersUtilsProvider>
    );
  }
}

export default ItemCreator;
