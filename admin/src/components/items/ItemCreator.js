import React, { Component } from "react";
import styled from "styled-components";
import MomentUtils from "@date-io/moment";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Snackbar from "@material-ui/core/Snackbar";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import PerkModal from "./PerkModal";
import PerkListBox from './PerkListBox'
import ImageWrapper from '../common/ImageWrapper'

import {asyncForEach} from '../../utils/methods'
import { itemsPath, appearancePath, altAppearancePath } from "../../utils/definitions";
import {classLabels, itemTypeLabels, equippableItems} from '../../utils/labels'
import {torpedoFields, userClasses} from '../../utils/modelArrays'

import { createItemModel, updateItemModel, uploadItemModelImages } from "../../store/actions/itemActions";
import { getProducts } from "../../store/actions/productActions";


const AddIcon = styled(AddCircleIcon)`
  width: 1.5rem;
  transition: transform 0.2s ease-in-out;
  transform: scale(1.8);
  &:active {
    transform: scale(1.5);
  }
`;


const validatedFields = ['type', 'name', 'description', 'iconView', 'appearanceView', 'altAppearanceView']
const imgFields = ['iconView', 'appearanceView', 'altAppearanceView']

const nullTarget = {
  'disc-product': null,
  'disc-category': null,
  'disc-rent': null
}
            
class ItemCreator extends Component {
  state = {
    name: '',
    description: '',
    type: null,
    icon: "",
    appearance: "",
    iconView: "",
    appearanceView: '',
    altAppearanceView: '',
    loyalAward: false,
    class: 'any',
    classItem: false,
    twoHanded: false,
    modifyingIndex: null,
    showPerkModal: false,
    perks: [],
    products: [],
    formError: {
      name: null,
      description: null,
      iconView: null,
      appearanceView: null,
      altAppearanceView: null,
    },
    snackbarOpen: false,
  };

  componentDidMount = () => {
      const item = this.props.item
      
      // console.log(item)
      this.setState({
        _id: item._id,
        name: item.name,
        description: item.description,
        type: item.type ? (item.type) : (Object.keys(itemTypeLabels)[0]),
        class: item.class,
        classItem: item.class !== 'any' ? true : false,
        loyalAward: item.loyalAward ? true : false,
        perks: item.perks,
        iconView: item.imgSrc ? (itemsPath + item.imgSrc) : null, 
        appearanceView: item.appearanceSrc ? (appearancePath + item.appearanceSrc) : null,
        altAppearanceView: item.altAppearanceSrc ? (altAppearancePath + item.altAppearanceSrc) : null,
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
        
        this.setState({
          appearance: "",
          appearanceView: '',
          altAppearance: "",
          altAppearanceView: '',
        }, () => {
          this.setState({
            formError: {
              ...this.state.formError,
              appearanceView: null,
              altAppearanceView: null
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
   // console.log(this.state.perks[index])
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

    const products = !this.state.showPerkModal && !this.state.products.length ? await getProducts({onlyNames: true}) : this.state.products

    
    this.setState({
      products: products    
    }, () => {
      this.setState(prevState => {
        return { 
          showPerkModal: !prevState.showPerkModal,
          modifyingIndex: prevState.showPerkModal ? null : prevState.modifyingIndex
        };
      })
    })
    
    
  };

  handleImgChange = (e, viewName, fileName) => {
    console.log(viewName, fileName)
    if (e.target.files.length > 0) {
      const url = URL.createObjectURL(e.target.files[0])
      this.setState({ [viewName]: url, [fileName]: e.target.files[0]}, () => this.callbacksAndValidation(viewName, url));
    }
  }

  // handleIconChange = e => {
    
  //   // if (e.target.files.length > 0) {
  //   //   const url = URL.createObjectURL(e.target.files[0])
  //   //   this.setState({ iconView: url, icon: e.target.files[0]}, () => this.callbacksAndValidation('iconView', url));
  //   // }
  // };

  // handleAppearanceChange = e => {
  //   this.imgChange(e, 'appearanceView', 'appearance')
  // };



  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

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
      return { 
        twoHanded: prevState.twoHanded ? false : true,
        altAppearance: !prevState.twoHanded ? "" : this.state.altAppearance,
        altAppearanceView: !prevState.twoHanded ? "" : this.state.altAppearanceView,
        formError: {
          ...this.state.formError,
          altAppearanceView: null
        }
        
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

    perk.time.sort((a, b) =>  a.startDay - b.startDay ||  a.startHour - b.startHour) //two fields sorting
    
    if(this.state.modifyingIndex != null){
      const perks = this.state.perks

      perks[this.state.modifyingIndex] = perk

      this.setState({
        perks: perks,
      }, () => {
        //console.log(this.state.perks)
        this.handleTogglePerkModal()
      })
    }else{
      this.setState({
        perks: [perk, ...this.state.perks]
      }, () => {
        this.handleTogglePerkModal()
      })
    }
    
  }

  callbacksAndValidation = (fieldName, fieldValue, prevFieldValue) => {

    if(validatedFields.includes(fieldName)){
      let error = ''

      if(fieldValue.length === 0){
        error = (imgFields.includes(fieldName)) ? ('Obraz wymagany!') : ('Pole wymagane!')
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
        //console.log(fieldName)
        if(!this.state[fieldName] || !this.state[fieldName].length){
          if((fieldName !== 'appearanceView' && fieldName !== 'altAppearanceView')
            || (fieldName === 'appearanceView'  && equippableItems.includes(this.state.type))
            || (fieldName === 'altAppearanceView' && !this.state.twoHanded && equippableItems.includes(this.state.type))){
            //console.log(fieldName, this.state[fieldName] === 'appearanceView', this.state.type, equippableItems.includes(this.state.type))
            this.setState({
              formError: {
                  ...this.state.formError,
                  [fieldName]: (imgFields.includes(fieldName)) ? ('Obraz wymagany!') : ('Pole wymagane!')
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
        twoHanded: this.state.twoHanded
      }
      if(item.twoHanded === undefined){
        delete item.twoHanded
      }

      if(!equippableItems.includes(item.type)){
        delete item.appearance
        delete item.altAppearance
      } 

      let itemModelId = null
      if(!(typeof this.props.modifyingItemIndex === "number")){
        delete item._id
        itemModelId = await createItemModel(item)
      }else{
        itemModelId = await updateItemModel(item)
      }
      //console.log(itemModelId)
      if(itemModelId && (this.state.icon || this.state.appearance || this.state.altAppearance)){
        const formData = new FormData()
        if(this.state.icon){
          formData.append('icon', this.state.icon)
        }
        if(this.state.appearance){
          formData.append('appearance', this.state.appearance)
        }
        if(this.state.altAppearance){
          formData.append('altAppearance', this.state.altAppearance)
        }
        try{
          await uploadItemModelImages(itemModelId, formData)
        }catch(e){
          this.setState({
            snackbarOpen: true,
          })
          return
        }
        
      }

      this.props.updateItems(item)
  }

 

  render() {

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Button onClick={this.props.handleClose}>{"< Powrót do panelu przedmiotów"}</Button>
        <Container>
          <Grid container spacing={5} style={{marginTop: '1rem'}}>
            <Grid item xs={6} style={{textAlign: 'left', paddingBottom: '0rem'}}>
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
              <Grid item xs={5} style={{paddingBottom: '0rem'}}>
                <ImageWrapper 
                  view={this.state.appearanceView}
                  text={'wygląd'}
                  secondaryText={this.state.type === 'weapon' ? '(Główna broń)': '(Męski)'}
                  viewName={'appearanceView'}
                  fileName={'appearance'}
                  accept={"image/svg+xml"}
                  error={this.state.formError.appearanceView}
                  imageChange={this.handleImgChange}

                />
              </Grid>
           )}

          <Grid item xs={7} style={{paddingTop: '0rem', paddingBottom: '0rem'}}>
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
          <Grid item xs={5} style={{paddingTop: '0rem', paddingBottom: '0rem'}}>
          {equippableItems.includes(this.state.type) && !this.state.twoHanded && (
            <ImageWrapper 
                view={this.state.altAppearanceView}
                text={'wygląd'}
                secondaryText={this.state.type === 'weapon' ? '(Druga broń)': '(Damski)'}
                viewName={'altAppearanceView'}
                fileName={'altAppearance'}
                accept={"image/svg+xml"}
                error={this.state.formError.altAppearanceView}
                imageChange={this.handleImgChange}

            />
           )}
           </Grid>

          <Grid item xs={6} style={{display: 'flex', flexDirection: 'column', paddingTop: '0rem'}}>
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
              label="Uwzględnij w puli nagród statków"
            />
          </Grid>
          <Grid item xs={1} style={{paddingTop: '0rem'}}>
          </Grid>
          <Grid item xs={5} style={{paddingTop: '0rem'}}>
          
          <ImageWrapper 
            view={this.state.iconView}
            text={'ikonę'}
            viewName={'iconView'}
            fileName={'icon'}
            accept={"image/*"}
            error={this.state.formError.iconView}
            imageChange={this.handleImgChange}

          />
          
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
                color="primary"
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
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          open={this.state.snackbarOpen}
          onClose={this.handleSnackbarClose}
          autoHideDuration={2000}
          message={"Obraz nie może zostać zapisany na serwerze!"}
        />
      </MuiPickersUtilsProvider>
    );
  }
}

export default ItemCreator;
