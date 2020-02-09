import React, { Component } from "react";
import moment from "moment";
import styled, {keyframes} from "styled-components";
import MomentUtils from "@date-io/moment";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Slider from "@material-ui/core/Slider";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import IconButton from '@material-ui/core/IconButton';
import { MuiPickersUtilsProvider, DateTimePicker} from "@material-ui/pickers";
import EditIcon from '@material-ui/icons/Edit';
import EventIcon from '@material-ui/icons/Event';

import AttributeBox from "./AttributeBox";
import AmuletsModal from "./AmuletsModal";
import ItemsModal from "./ItemsModal";

import {classLabelsAll} from '../../utils/labels'
import { convertItemModelsToCategories } from "../../utils/methods";
import { itemsPath, missionsPath, ralliesPath } from "../../utils/definitions";
import {createEvent, updateEvent, uploadEventIcon, getRallies} from '../../store/actions/eventActions'
import { getItemModels } from "../../store/actions/itemActions";



import "moment/locale/pl";
moment.locale("pl");

const alertAnimation = keyframes`
0%{
  color: rgb(231, 0, 0)
}
100%{
  color: rgba(231, 0, 0, 0.3);
}

`


const FileInputWrapper = styled.div`
  position: relative;
  background: red;
  height: 2.5rem;
  width: 14rem;
  margin: 2rem 0;
`;

const HiddenFileInput = styled(Input)`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  height: 2.5rem;
  width: 14rem;
  user-select: none;
`;

const FileInputButton = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  height: 2.5rem;
  width: 14rem;
`;

const DateErrorMessage = styled(Typography)`
animation: ${alertAnimation} 1s ease-out infinite alternate;
`

class EventCreator extends Component {
  state = {
    _id: null,
    isRally: false,
    unique: false,
    title: "",
    description: "",
    minLevel: 1,
    iconView: "",
    minPlayers: 1,
    maxPlayers: 8,
    strength: 1,
    dexterity: 1,
    magic: 1,
    endurance: 1,
    showAmuletsModal: false,
    amulets: [],
    showItemsModal: false,
    experience: 0,
    awardLevelExperienceInput: 0,
    editableAwardLevelExperienceInput: 0,
    awardsAreSecret: false,
    fullItemsList: {},
    items: { any: [], warrior: [], mage: [], rogue: [], cleric: [] },
    awardsLevels: [],
    currentAwardTier: -1,
    activationDate: moment().format("YYYY-MM-DDTHH:mm"),
    startDate: moment()
      .add(1, "d")
      .format("YYYY-MM-DDTHH:mm"),
    isInstant: false,
    raidIsInstantStart: false,
    expiryDate: moment()
      .add(2, "d")
      .format("YYYY-MM-DDTHH:mm"),
    isPermanent: false,
    dateErrors: {
      activationDate: ["", ""],
      startDate: ["", ""],
      expiryDate: ["", ""]
    },
    collisionRallyList: [],
    validationErrors: {
      title: "",
      minLevel: "",
      description: "",
      iconView: ""
    },
    dirtyFields: {
      title: false,
      minLevel: false,
      description: false,
      iconView: false
    },
    disableSubmit: true,
    rallies: [],
    dateErrorClearingTimeout: null
  };


  componentWillUnmount() {
    if(this.state.dateErrorClearingTimeout){
      clearTimeout(this.state.dateErrorClearingTimeout)
    }
  }
  

 async componentDidMount() {
    //fetch things from back end
    let itemModels = await getItemModels()
    const rallies = await getRallies()
    itemModels.forEach(itemModel => {
      itemModel.itemModel = itemModel._id
      delete itemModel._id
    })
    itemModels = convertItemModelsToCategories(itemModels)
    //console.log(itemModels)
    this.setState(
      {
        amulets: itemModels.hasOwnProperty('amulet') && itemModels.amulet.length ? [...itemModels.amulet] : [],
        fullItemsList: itemModels,
        rallies
      },
      () => {
        if (this.props.isEdit) {
          const event = { ...this.props.eventToEdit };
          //console.log(event)
          if (event.hasOwnProperty("level") && event.level) {
            //MISSION
            Object.keys(event.awards).forEach(awardClass => {
              event.awards[awardClass] = event.awards[awardClass].map(award => {
                const id = award.itemModel._id 
                delete award.itemModel._id 
                return {...award.itemModel, quantity: award.quantity, itemModel: id}
              })
            })
  
            const amulets = this.state.amulets.map(amulet => {
              return {
                ...amulet,
                quantity:
                event.amulets.find(
                  eventAmulet =>
                  eventAmulet.itemModel._id === amulet.itemModel
                  ) !== undefined
                  ? event.amulets.find(
                    eventAmulet =>
                    eventAmulet.itemModel._id === amulet.itemModel
                    ).quantity
                    : 0
                  };
                });
            this.setState({
              _id: event._id,
              isRally: false,
              unique: event.unique,
              title: event.title,
              description: event.description,
              minLevel: event.level+"",
              iconView:  event.imgSrc ? (missionsPath + event.imgSrc) : null, 
              minPlayers: event.minPlayers,
              maxPlayers: event.maxPlayers,
              amulets: [...amulets],
              experience: event.experience,
              strength: event.strength,
              dexterity: event.dexterity,
              magic: event.magic,
              endurance: event.endurance,
              items: {
                any: [],
                warrior: [],
                mage: [],
                rogue: [],
                cleric: [],
                ...event.awards
              },
              activationDate: moment(event.activationDate).format("YYYY-MM-DDTHH:mm"),
              expiryDate: moment(event.expiryDate).format("YYYY-MM-DDTHH:mm"),
              isPermanent: moment(event.expiryDate).isSameOrAfter('2220-01-01', 'year'),
              awardsAreSecret: event.awardsAreSecret
            }, () => {

              const dirtyFields = {
                title: this.state.title ? true : false,
                minLevel: this.state.minLevel ? true : false,
                description: this.state.description ? true : false,
                iconView: this.state.iconView ? true : false
              }
              this.setState({dirtyFields}, () => {
                this.validateRequiredFields()
              })
            });
          } else {
            event.awardsLevels.forEach(awardLevel => {
              //console.log(awardLevel)
              Object.keys(awardLevel.awards).forEach(awardClass => {
                awardLevel.awards[awardClass] = awardLevel.awards[awardClass].map(award => {
                  const id = award.itemModel._id 
                  delete award.itemModel._id 
                  return {...award.itemModel, quantity: award.quantity, itemModel: id}
                })
              })
            })

            this.setState({
              _id: event._id,
              isRally: true,
              title: event.title,
              description: event.description,
              iconView: event.imgSrc ? (ralliesPath + event.imgSrc) : null, 
              experience: event.experience,
              awardsLevels: [...event.awardsLevels],
              activationDate: moment(event.activationDate).format("YYYY-MM-DDTHH:mm"),
              startDate: moment(event.startDate).format("YYYY-MM-DDTHH:mm"),
              expiryDate: moment(event.expiryDate).format("YYYY-MM-DDTHH:mm"),
              awardsAreSecret: event.awardsAreSecret
            }, () => {
              const dirtyFields = {
                title: this.state.title ? true : false,
                description: this.state.description ? true : false,
                iconView: this.state.iconView ? true : false
              }
              this.setState({dirtyFields}, () => {
                this.handleCheckRallyDates()
                this.validateRequiredFields()
              })
            });
          }
          
        }
      }
    );
  }

  handleValidateDates = (value, type, isRally) => {
    const event = {
      activationDate: moment(this.state.activationDate),
      startDate: isRally ? moment(this.state.startDate) : null,
      expiryDate: moment(this.state.expiryDate)
    };

    event[type] = moment(value);

    const errors = { ...this.state.dateErrors };
    errors[type] = ["",""]


    switch (type) {
      case "activationDate":
        if ( event.activationDate.isSameOrAfter(event.expiryDate)) {
          errors.activationDate[0] =
            "Czas publikacji nie może być późniejszy niż czas zakończenia";
        } else {
          errors.activationDate[0] = "";
        }
        if (isRally && event.activationDate.isAfter(event.startDate)) {
          errors.activationDate[1] =
            "Czas publikacji nie może być późniejszy niż czas rozpoczęcia";
        } else {
          errors.activationDate[1] = "";
        }

        break;
      case "startDate":
        if ( isRally && event.startDate.isBefore(event.activationDate)) {
          errors.startDate[0] =
            "Czas rozpoczęcia nie może być wcześniejszy niż czas publikacji";
        } else {
          errors.startDate[0] = "";
        }
        if (isRally && event.startDate.isSameOrAfter(event.expiryDate)) {
          errors.startDate[1] =
            "Czas rozpoczęcia nie może być późniejszy niż czas zakończenia";
        } else {
          errors.startDate[1] = "";
        }
        break;

      case "expiryDate":
        if (event.expiryDate.isSameOrBefore(event.activationDate)) {
          errors.expiryDate[0] =
            "Czas zakończenia nie może być wcześniejszy niż czas publikacji";
        } else {
          errors.expiryDate[0] = "";
        }
        if (isRally && event.expiryDate.isSameOrBefore(event.startDate)) {
          errors.expiryDate[1] =
            "Czas zakończenia nie może być wcześniejszy niż czas rozpoczęcia";
        } else {
          errors.expiryDate[1] = "";
        }
        break;

      default:
        break;

    }
    if(this.state.dateErrorClearingTimeout){
      clearTimeout(this.state.dateErrorClearingTimeout)
    }

    const dateErrorClearingTimeout = setTimeout(() => {
      this.setState({dateErrors: {
        activationDate: ["", ""],
        startDate: ["", ""],
        expiryDate: ["", ""]
      },})
    }, 3500);

    this.setState({dateErrorClearingTimeout})

    if (
     errors[type]
        .every(error => error === "")
    ) {
      return { value, errors };
    } else {
      return { value: null, errors };
    }
  };

  handleCheckRallyDates = async () => {
    if (
      this.state.activationDate &&
      this.state.expiryDate &&
      this.state.startDate
    ) {


        const rally = {
          activationDate: moment(this.state.activationDate),
          expiryDate: moment(this.state.expiryDate)
        };

        const newRallyActivation = rally.activationDate.valueOf();
        const newRallyEnd = rally.expiryDate.valueOf();

        let causingRallyList = [];
        this.state.rallies.forEach(rallyItem => {
          
          if(this.props.isEdit && this.state._id === rallyItem._id){
            return
          }
          const existingRallyActiviation = moment(rallyItem.activationDate).valueOf();
          const existingRallyEnd = moment(rallyItem.expiryDate).valueOf();
         
          if (
            !(
              (existingRallyActiviation < newRallyActivation &&
                existingRallyEnd < newRallyActivation) ||
              (existingRallyEnd > newRallyEnd &&
                existingRallyActiviation > newRallyEnd)
            )
          ) {

           
            causingRallyList = [...causingRallyList, rallyItem]; //assembling list of 'bad' rallies :<<
          }

        });

        if (causingRallyList.length > 0) {
          this.setState({
            collisionRallyList: [...causingRallyList],
            disableSubmit: true
          }, () => {
            this.validateRequiredFields()
          });
        } else {
          this.setState({ collisionRallyList: []}, () => {
            this.validateRequiredFields()
          });
        }
 
    }
  };

  handleUniqueChange = () => {
    this.setState(prevState => {
      return { unique: !prevState.unique };
    });
  };

  handleEndDateChange = input => {
    const date = input.format("YYYY-MM-DDTHH:mm")
    const result = this.handleValidateDates(
      date,
      "expiryDate",
      this.state.isRally
    );

    this.setState(
      prevState => {
        return {
          expiryDate: result.value ? result.value : prevState.expiryDate,
          dateErrors: { ...result.errors }
        };
      },
      () => {
        if (this.state.isRally) {
          this.handleCheckRallyDates();
        }else{
          this.validateRequiredFields()
        }
      }
    );
  };

  handleRaidStartTimeChange = (input, cb) => {
    const date = input.format("YYYY-MM-DDTHH:mm")
    const result = this.handleValidateDates(
      date,
      "startDate",
      this.state.isRally
    );

    this.setState(
      prevState => {
        return {
          startDate: result.value ? result.value : prevState.startDate,
          dateErrors: { ...result.errors }
        };
      },
      () => {
        if (this.state.isRally) {
          this.handleCheckRallyDates();
        }else{
          this.validateRequiredFields()
        }
        if(cb && this.state.dateErrors.startDate.every(err => err==="")){
          cb()
        }
      }
    );
  };

  handleActivationDateChange = (input, cb) => {
    const date = input.format("YYYY-MM-DDTHH:mm")
    const result = this.handleValidateDates(
      date,
      "activationDate",
      this.state.isRally
    );


    this.setState(
      prevState => {
        return {
          activationDate: result.value
            ? result.value
            : prevState.activationDate,
            startDate: result.value && this.state.isRally && this.state.raidIsInstantStart ? result.value : prevState.startDate,
          dateErrors: { ...result.errors }
        };
      },
      () => {
        
        if (this.state.isRally) {
          this.handleCheckRallyDates();
        }else{
          this.validateRequiredFields()
        }
        if(cb && this.state.dateErrors.activationDate.every(err => err==="")){
          cb()
        }
      }
    );
  };

  handlePermanentChange = () => {
    this.setState(prevState => {
      return { isPermanent: !prevState.isPermanent };
    }, () => {
      this.handleEndDateChange(moment().add(200, 'y'))
    });
  };

  handleRaidInstantStart = () => {
    if(this.state.collisionRallyList.length <= 0){
      this.handleRaidStartTimeChange(moment(this.state.activationDate), () => {
        this.setState(prevState => {
          return { raidIsInstantStart: !prevState.raidIsInstantStart };
        })

      })

    }
  };

  handleInstantChange = () => {
    if(this.state.collisionRallyList.length <= 0){

      this.handleActivationDateChange(moment(), () => {
        this.setState(prevState => {
          return { isInstant: !prevState.isInstant };
        })
      })
    }

  };

  handlePartySizeSliderChange = (event, newValue) => {
    this.setState({ minPlayers: newValue[0], maxPlayers: newValue[1] });
  };

  handleChangeItemQuantity = (currentItem, quantity, characterClass, tier) => {
    let allItems, awardsLevels;
    if (this.state.isRally) {
      awardsLevels = [...this.state.awardsLevels];
      allItems = { ...awardsLevels[tier].awards };
    } else {
      allItems = { ...this.state.items };
    }
    const classItems = [...allItems[characterClass]];
    const idOfItem = classItems.findIndex(
      item => item.itemModel === currentItem.itemModel
    );

    classItems[idOfItem].quantity = parseInt(quantity);

    allItems[characterClass] = classItems;
    if (this.state.isRally) {
      awardsLevels[tier].awards = allItems;
      this.setState({ awardsLevels });
    } else {
      this.setState({ items: allItems });
    }
  };

  handleSubtractItem = (currentItem, characterClass, tier) => {
    let allItems, awardsLevels;
    if (this.state.isRally) {
      awardsLevels = [...this.state.awardsLevels];
      allItems = { ...awardsLevels[tier].awards };
    } else {
      allItems = { ...this.state.items };
    }
    let classItems = [...allItems[characterClass]];
    const idOfItem = classItems.findIndex(
      item => item.itemModel === currentItem.itemModel
    );

    classItems[idOfItem].quantity -= 1;
    if (classItems[idOfItem].quantity === 0) {
      classItems.splice(idOfItem, 1);
    }
    allItems[characterClass] = classItems;
    if (this.state.isRally) {
      awardsLevels[tier].awards = allItems;
      this.setState({ awardsLevels });
    } else {
      this.setState({ items: allItems });
    }
  };

  handleAddItem = (currentItem, characterClass, tier) => {
    let allItems, awardsLevels;
    if (this.state.isRally) {
      awardsLevels = [...this.state.awardsLevels];
      allItems = { ...awardsLevels[tier].awards };
    } else {
      allItems = { ...this.state.items };
    }
    const classItems = [...allItems[characterClass]];
    const idOfItemAlreadyAdded = classItems.findIndex(
      item => item.itemModel === currentItem.itemModel
    );
    if (idOfItemAlreadyAdded === -1) {
      classItems.push({ ...currentItem, quantity: 1 });
    } else {
      classItems[idOfItemAlreadyAdded].quantity += 1;
    }
    allItems[characterClass] = classItems;
    if (this.state.isRally) {
      awardsLevels[tier].awards = allItems;
      this.setState({ awardsLevels });
    } else {
      this.setState({ items: allItems });
    }
  };

  handleChangeAwardsAreSecret = e => {
    this.setState(prevState => {
      return { awardsAreSecret: !prevState.awardsAreSecret };
    });
  };

  handleDeleteAwardLevel = (level) => {
    let awardsLevels = [...this.state.awardsLevels];
    awardsLevels = awardsLevels.filter(awardLevel => awardLevel.level !== level)
   this.setState({awardsLevels}) 
  }

  handleAddNewAwardLevel = () => {
    const awardsLevels = [...this.state.awardsLevels];
    if (
      !awardsLevels.find(
        awardLevel => awardLevel.level === this.state.awardLevelExperienceInput
      )
    ) {
      awardsLevels.push({
        level: this.state.awardLevelExperienceInput,
        awards: { any: [], warrior: [], mage: [], rogue: [], cleric: [] }
      });
      awardsLevels.sort((a, b) => a.level - b.level);
      this.setState({ awardLevelExperienceInput: 0, awardsLevels });
    }
  };

  handleChangeEditableAwardLevelExperienceInput = (e, level)=>{
    const input = e.target.value.replace(/^0+/, "").trim()
    const tempAwardsLevels = [...this.state.awardsLevels]
    const toEdit = tempAwardsLevels.find(tal => tal.level === level)
    toEdit.level = input
    this.setState({
      editableAwardLevelExperienceInput: input,
      awardsLevels: tempAwardsLevels}, () => {
        this[level].focus()
      })

  }

  handleAwardLevelExperienceToggle = (e, level) => {
    const tempAwardsLevels = [...this.state.awardsLevels]
    const toEdit = tempAwardsLevels.find(tal => tal.level === level)
    if(toEdit.hasOwnProperty('allowChangeExperience') && toEdit.allowChangeExperience){
      toEdit.allowChangeExperience = false
    }else{
      toEdit.allowChangeExperience = true
    }
    this.setState({
      awardsLevels: tempAwardsLevels,
      editableAwardLevelExperienceInput:  toEdit.allowChangeExperience ? toEdit.level : 0
    });
  }

  handleChangeAwardLevelExperienceInput = e => {
    this.setState({
      awardLevelExperienceInput: e.target.value.replace(/^0+/, "").trim()
    });
  };

  handleChangeExperience = e => {
    this.setState({ experience: e.target.value.replace(/^0+/, "").trim() });
  };

  handleChangeAmuletQuantity = (id, quantity) => {
    const amulets = [...this.state.amulets];
    const idOfAmulet = amulets.findIndex(amulet => amulet.itemModel === id);
    if (idOfAmulet !== -1) {
      amulets[idOfAmulet].quantity = parseInt(quantity);
      this.setState({ amulets });
    }
  };

  handleSubtractAmulet = id => {
    const amulets = [...this.state.amulets];
    const idOfAmulet = amulets.findIndex(amulet => amulet.itemModel === id);
    if (idOfAmulet !== -1) {
      amulets[idOfAmulet].quantity -= 1;

      this.setState({ amulets });
    }
  };

  handleDeleteAmulet = id => {
    const amulets = [...this.state.amulets];
    const idOfAmulet = amulets.findIndex(amulet => amulet.itemModel === id);
    if (idOfAmulet !== -1) {
      amulets[idOfAmulet].quantity = 0;

      this.setState({ amulets });
    }
  };

  handleAddAmulet = id => {
    const amulets = [...this.state.amulets];
    const thisAmulet = amulets.find(amulet => amulet.itemModel === id)
    if(thisAmulet.quantity > 0){
      thisAmulet.quantity += 1
    }else{
      thisAmulet.quantity = 1
    }
    this.setState({amulets})
  };

  handleToggleRallyItemsModal = (e, awardTier) => {
    this.setState(prevState => {
      return {
        showItemsModal: !prevState.showItemsModal,
        currentAwardTier: awardTier
      };
    });
  };

  handleToggleItemsModal = e => {
    this.setState(prevState => {
      return { showItemsModal: !prevState.showItemsModal };
    });
  };

  handleToggleAmuletsModal = e => {
    this.setState(prevState => {
      return { showAmuletsModal: !prevState.showAmuletsModal };
    });
  };

  handleChangeAttributeValue = (e, attr, n) => {
    let attributeValue = this.state[attr];
    if (n) {
      attributeValue += n;
    } else {
      if (/^\d+$/.test(e.target.value)) {
        attributeValue = parseInt(e.target.value);
      }
    }
    if(attributeValue > -1){
      this.setState({ [attr]: attributeValue });
    }
  };

  handleMakeDirtyField = (field) => {
    const dirty = {...this.state.dirtyFields}
    dirty[field] = true
    return dirty
  }

  handleIconChange = e => {
    if (e.target.files.length > 0) {
      this.setState({ icon: e.target.files[0], iconView: URL.createObjectURL(e.target.files[0]), dirtyFields: this.handleMakeDirtyField('iconView') }, () => {
        this.validateRequiredFields();
      });
    }
  };

  handleDescriptionChange = e => {
    this.setState({ description: e.target.value, dirtyFields: this.handleMakeDirtyField('description') }, () => {
      this.validateRequiredFields();
    });
  };

  handleMinLevelChange = e => {
    if(/^\d+$/.test(e.target.value)){

      this.setState({ minLevel: e.target.value.trim(), dirtyFields: this.handleMakeDirtyField('minLevel') }, () => {
        this.validateRequiredFields();
      });
    }
  };

  handleNameChange = e => {
    this.setState({ title: e.target.value, dirtyFields: this.handleMakeDirtyField('title') }, () => {
      this.validateRequiredFields();
    });
  };

  handleToggleRaid = e => {
    this.setState(prevState => {
      if(!prevState.isRally){
        this.handleCheckRallyDates()
      }
      return { isRally: !prevState.isRally };
    });
  };



  validateRequiredFields = () => {
    const validationErrors = {
      title: "Pole wymagane",
      minLevel: "Pole wymagane",
      description: "Pole wymagane",
      iconView: "Wczytaj ikonę"
    };
    if (this.state.dirtyFields.title && this.state.title.trim() !== "") {
      validationErrors.title = "";
    }
    if (this.state.minLevel !== -1) {
      validationErrors.minLevel = "";
    }
    if(this.state.isRally){
      validationErrors.minLevel = "";
    }
    if (this.state.dirtyFields.description && this.state.description.trim() !== "") {
      validationErrors.description = "";
    }
    if (this.state.dirtyFields.iconView && this.state.iconView) {
      validationErrors.iconView = "";
    }
    

    let inputAndDateValidation = Object.values(validationErrors).every(error => error === "") && Object.values(this.state.dateErrors)
    .reduce((a, b) => a.concat(b))
    .every(error => error === "")
    if (this.state.isRally) {
      if (this.state.collisionRallyList.length > 0) {
        inputAndDateValidation = false
      }
    }


    this.setState({ disableSubmit: !inputAndDateValidation, validationErrors });

  };

  handleSubmit = async () => {
    let event = {
      _id: this.state._id,
      title: this.state.title,
      description: this.state.description,
      activationDate: this.state.activationDate,
      expiryDate: this.state.expiryDate,
      experience: this.state.experience,
      awardsAreSecret: this.state.awardsAreSecret

    }
    let eventId = null
    if(this.state.isRally){
      event.startDate = this.state.startDate
      event.awardsLevels = this.state.awardsLevels
    }else{
      event.minPlayers = this.state.minPlayers
      event.maxPlayers = this.state.maxPlayers
      event.strength = this.state.strength
      event.dexterity = this.state.dexterity
      event.magic = this.state.magic
      event.endurance = this.state.endurance
      event.level = this.state.minLevel
      event.unique = this.state.unique
      const amulets = this.state.amulets.filter(amulet => amulet.quantity > 0)
      event.amulets = amulets
                        // event.amulets.forEach(amulet => {
                        //   amulet.itemModel = amulet._id
                        //   delete amulet._id
                        // })
      event.awards = this.state.items

    }
    
    const eventType = this.state.isRally ? 'rally' : 'mission'
    if(this.props.isEdit){
      eventId = await updateEvent(eventType, event)
    }else{
      delete event._id
      eventId = await createEvent(eventType, event)
    }

    if(eventId && this.state.icon){
      const formData = new FormData()
      if(this.state.icon){
        formData.append('icon', this.state.icon)
      }
      
      await uploadEventIcon(eventType, eventId, formData)
    }

      this.props.handleClose();

  };

// shouldComponentUpdate(nextProps, nextState) {
//   if(this.state.editableAwardLevelExperienceInput !== nextState.editableAwardLevelExperienceInput){
//     return false
//   }
// }


  render() {
    let amuletListEmpty =
      this.state.amulets.filter(amulet => amulet.quantity > 0).length === 0;

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Button onClick={this.props.handleClose}>
          {"< Powrót do panelu wydarzeń"}
        </Button>
        <Container>
          <Typography component="div">
            <Grid component="label" container alignItems="center" spacing={1}>
              {!this.props.isEdit ?
              <React.Fragment>
                <Grid item>Misja</Grid>
                <Grid item>
                  <Switch
                    checked={this.state.isRally}
                    onChange={this.handleToggleRaid}
                  />
                </Grid>
                <Grid item>Rajd</Grid>
              </React.Fragment> :
  <Grid item>{this.state.isRally ? 'Rajd' : 'Misja'}</Grid>
              }
              <Grid item>
                {!this.state.isRally && (
                  <FormControlLabel
                    style={{ marginLeft: "4rem" }}
                    control={
                      <Checkbox
                        checked={this.state.unique}
                        onChange={this.handleUniqueChange}
                      />
                    }
                    label="Misja unikalna"
                  />
                )}
              </Grid>
            </Grid>
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                value={this.state.title}
                onChange={this.handleNameChange}
                autoFocus
                margin="dense"
                label={`Nazwa ${this.state.isRally ? "rajdu" : "misji"}`}
                type="text"
                fullWidth
                required
                error={this.state.dirtyFields.title && this.state.validationErrors.title ? true : false}
                helperText={this.state.dirtyFields.title && this.state.validationErrors.title}
              />
            </Grid>
            <Grid item xs={4}>
              {!this.state.isRally && (
                <TextField
                  value={this.state.minLevel}
                  onChange={this.handleMinLevelChange}
                  margin="dense"
                  label="Minimalny poziom"
                  type="number"
                  inputProps={{ min: "1", type: "number" }}
                  required
                  error={this.state.dirtyFields.minLevel && this.state.validationErrors.minLevel ? true : false}
                  helperText={this.state.dirtyFields.minLevel && this.state.validationErrors.minLevel}
                />
              )}
            </Grid>
          </Grid>
          <TextField
            value={this.state.description}
            onChange={this.handleDescriptionChange}
            margin="dense"
            label={`Opis ${this.state.isRally ? "rajdu" : "misji"}`}
            type="text"
            fullWidth
            multiline
            rows={2}
            rowsMax={5}
            required
            error={this.state.dirtyFields.description && this.state.validationErrors.description ? true : false}
            helperText={this.state.dirtyFields.description && this.state.validationErrors.description}
          />
          <Grid container spacing={2}>
            {this.state.dirtyFields.iconView && this.state.validationErrors.iconView && 
            <Grid item>
  <Typography style={{ color: "rgb(206, 0, 0)" }}>{this.state.validationErrors.iconView}</Typography>
            </Grid>
            }
            <Grid item>
              <FileInputWrapper>
                <FileInputButton variant="contained" color="primary">
                  {this.state.iconView ? "Zmień ikonę" : "Dodaj ikonę"}{" "}
                  {this.state.isRally ? " rajdu *" : " misji *"}
                </FileInputButton>
                <HiddenFileInput
                  type="file"
                  onChange={this.handleIconChange}
                  inputProps={{accept: 'image/*'}}
                />
              </FileInputWrapper>
            </Grid>
            <Grid
              item
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {this.state.iconView && (
                <img alt=''
                  src={this.state.iconView}
                  style={{ width: "64px" }}
                />
              )}
            </Grid>
          </Grid>
          {!this.state.isRally && (
            <React.Fragment>
              <Typography style={{ marginBottom: "3rem", textAlign: "left" }}>
                Wielkość drużyny:
              </Typography>
              <Slider
                value={[this.state.minPlayers, this.state.maxPlayers]}
                onChange={this.handlePartySizeSliderChange}
                valueLabelDisplay="on"
                min={1}
                max={8}
              />
              <Divider style={{ marginTop: "2rem", marginBottom: "1rem" }} />
              <div>
                <Typography style={{ width: "fit-content", margin: "1rem 0" }}>
                  Wymagane wartości atrybutów:
                </Typography>
                <AttributeBox
                  value={this.state.strength}
                  attrType="strength"
                  attrTypeText="Siła"
                  changeValue={this.handleChangeAttributeValue}
                />
                <AttributeBox
                  value={this.state.dexterity}
                  attrType="dexterity"
                  attrTypeText="Zręczność"
                  changeValue={this.handleChangeAttributeValue}
                />
                <AttributeBox
                  value={this.state.magic}
                  attrType="magic"
                  attrTypeText="Magia"
                  changeValue={this.handleChangeAttributeValue}
                />
                <AttributeBox
                  value={this.state.endurance}
                  attrType="endurance"
                  attrTypeText="Wytrzymałość"
                  changeValue={this.handleChangeAttributeValue}
                />
              </div>
              <Divider style={{ marginTop: "2rem", marginBottom: "1rem" }} />
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleToggleAmuletsModal}
                    style={{ marginBottom: "1rem" }}
                  >
                    {amuletListEmpty
                      ? "Dodaj wymagane amulety"
                      : "Edytuj wymagane amulety"}
                  </Button>
                </Grid>
              </Grid>

              <AmuletsModal
                open={this.state.showAmuletsModal}
                handleClose={this.handleToggleAmuletsModal}
                amuletList={this.state.amulets}
                eventAmuletsList={this.state.amulets}
                handleAddAmulet={this.handleAddAmulet}
                handleSubtractAmulet={this.handleSubtractAmulet}
                handleDeleteAmulet={this.handleDeleteAmulet}
                handleChangeAmuletQuantity={this.handleChangeAmuletQuantity}
              />
              {!amuletListEmpty > 0 && !this.state.showAmuletsModal && (
                <Grid
                  spacing={2}
                  style={{ width: "100%" }}
                  direction="row"
                  container
                  alignItems="flex-end"
                >
                  {this.state.amulets
                    .filter(amulet => amulet.quantity > 0)
                    .map(amulet => {
                      return (
                        <Grid item key={amulet.id}>
                          <ListItemAvatar>
                            <img alt=''
                              src={itemsPath +
                                amulet.imgSrc}
                              width="64px"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={amulet.name}
                            secondary={"x" + amulet.quantity}
                            style={{ marginLeft: "1rem" }}
                          />
                        </Grid>
                      );
                    })}
                </Grid>
              )}
            </React.Fragment>
          )}

          <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Typography style={{ textAlign: "left" }}>Nagrody:</Typography>
          <Grid
            container
            direction="column"
            spacing={2}
            alignItems="flex-start"
          >
            <Grid item style={{ minWidth: "20vw" }}>
              <TextField
                value={this.state.experience}
                onChange={this.handleChangeExperience}
                margin="dense"
                label="Punkty doświadczenia"
                type="number"
                inputProps={{ min: "0", step: "50" }}
                style={{ width: "100%" }}
              />
            </Grid>

            {this.state.isRally && (
              <Grid
                item
                container
                alignItems="center"
                justify="flex-start"
                spacing={2}
              >
                <Grid item style={{ minWidth: "20vw" }}>
                  <TextField
                    value={this.state.awardLevelExperienceInput}
                    onChange={this.handleChangeAwardLevelExperienceInput}
                    margin="dense"
                    label="Wymagane doświadczenie"
                    type="number"
                    inputProps={{ min: "0" }}
                    style={{ width: "100%" }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleAddNewAwardLevel}
                  >
                    Dodaj poziom nagród
                  </Button>
                </Grid>
              </Grid>
            )}

            {this.state.isRally ? (
              this.state.awardsLevels.map((awardLevel, index) => {
                return (
                  <Paper
                    key={index}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      margin: "0.5rem 0",
                      boxSizing: "border-box"
                    }}
                  >
                    <Grid item container>
                      <Grid item xs={2}>
                        <Typography variant="h6">Próg {index + 1}.</Typography>
                      </Grid>
                      <Grid item xs={4} container>
                        <Grid item >
                          {awardLevel.hasOwnProperty('allowChangeExperience') && awardLevel.allowChangeExperience ?
                          <TextField
                          ref={ref=>this[awardLevel.level] = ref}
                          value={this.state.editableAwardLevelExperienceInput}
                          onChange={(e) => this.handleChangeEditableAwardLevelExperienceInput(e, awardLevel.level)}
                          margin="dense"
                          label="Wymagane doświadczenie"
                          type="number"
                          inputProps={{ min: "0" }}
                          onBlur={e=>this.handleAwardLevelExperienceToggle(e, awardLevel.level)}
                        />:
                        <Typography variant="h6" style={{marginRight: '1rem'}}>{`Minimum ${awardLevel.level} PD`}</Typography>
                        }

                          </Grid>
                          <Grid item >
                          
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={e =>
                            this.handleAwardLevelExperienceToggle(e, awardLevel.level)
                          }
                        >
                          <EditIcon />
                        </Button>
                          </Grid>
                      </Grid>
                      <Grid item xs={6} container direction="row" justify="space-evenly">
                        <Grid item style={{marginBottom: '1rem'}}>

                        <Button
                          variant="contained"
                          color="primary"
                          onClick={e =>
                            this.handleToggleRallyItemsModal(e, index)
                          }
                        >
                          Dodaj nagrody do tego progu
                        </Button>
                        </Grid>
                        <Grid item>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={e =>
                            this.handleDeleteAwardLevel(awardLevel.level)
                          }
                        >
                          Usuń próg
                        </Button>

                        </Grid>


                        
                      </Grid>
                    </Grid>
                    {!this.state.showItemsModal && (
                      <div
                        style={{
                          maxHeight: "30vh",
                          display: "flex",
                          justifyContent: "space-around",
                          overflow: "hidden",
                          width: "70%",
                          marginTop: "1rem"
                        }}
                      >
                        {awardLevel.awards.any.length > 0 && (
                          <div
                            style={{
                              overflow: "auto",
                              borderRight:
                                (this.state.items.warrior.length > 0 ||
                                  this.state.items.mage.length > 0 ||
                                  this.state.items.rogue.length > 0 ||
                                  this.state.items.cleric.length > 0) &&
                                "1px solid grey",
                              flexBasis: "50%"
                            }}
                          >
                            <Typography style={{ fontWeight: "bolder" }}>
                              Wszystkie klasy
                            </Typography>
                            <List dense>
                              {awardLevel.awards.any.map(item => {
                                return (
                                  <ListItem>
                                    <ListItemAvatar>
                                      <img alt=''
                                        src={itemsPath +
                                          item.imgSrc}
                                        style={{
                                          width: "32px",
                                          height: "32px"
                                        }}
                                      />
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={item.name}
                                      secondary={"x" + item.quantity}
                                    />
                                  </ListItem>
                                );
                              })}
                            </List>
                          </div>
                        )}
                        <div style={{ overflow: "auto", flexBasis: "50%" }}>
                          <List dense>
                            {Object.keys(awardLevel.awards)
                              .filter(
                                characterClass =>
                                  characterClass !== "any" &&
                                  awardLevel.awards[characterClass].length > 0
                              )
                              .map(characterClass => {
                                return (
                                  <React.Fragment>
                                    <Typography
                                      style={{ fontWeight: "bolder" }}
                                    >
                                      {classLabelsAll[characterClass]}
                                    </Typography>
                                    {awardLevel.awards[characterClass].map(
                                      item => {
                                        return (
                                          <ListItem>
                                            <ListItemAvatar>
                                              <img alt=''
                                                src={itemsPath +
                                                  item.imgSrc}
                                                style={{
                                                  width: "32px",
                                                  height: "32px"
                                                }}
                                              />
                                            </ListItemAvatar>
                                            <ListItemText
                                              primary={item.name}
                                              secondary={"x" + item.quantity}
                                            />
                                          </ListItem>
                                        );
                                      }
                                    )}
                                  </React.Fragment>
                                );
                              })}
                          </List>
                        </div>
                      </div>
                    )}
                  </Paper>
                );
              })
            ) : (
              <Grid item container>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleToggleItemsModal}
                  >
                    Dodaj nagrody
                  </Button>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    style={{ marginLeft: "4rem" }}
                    control={
                      <Checkbox
                        checked={this.state.awardsAreSecret}
                        onChange={this.handleChangeAwardsAreSecret}
                      />
                    }
                    label="Nagrody są tajne"
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          {!this.state.showItemsModal && !this.state.isRally && (
            <div
              style={{
                maxHeight: "30vh",
                display: "flex",
                justifyContent: "space-around",
                overflow: "hidden",
                width: "70%",
                marginTop: "1rem"
              }}
            >
              {this.state.items.any.length > 0 && (
                <div
                  style={{
                    overflow: "auto",
                    borderRight:
                      (this.state.items.warrior.length > 0 ||
                        this.state.items.mage.length > 0 ||
                        this.state.items.rogue.length > 0 ||
                        this.state.items.cleric.length > 0) &&
                      "1px solid grey",
                    flexBasis: "50%"
                  }}
                >
                  <Typography style={{ fontWeight: "bolder" }}>
                    Wszystkie klasy
                  </Typography>
                  <List dense>
                    {this.state.items.any.map(item => {
                      return (
                        <ListItem key={item.itemModel}>
                          <ListItemAvatar>
                            <img alt=''
                              src={itemsPath +
                                item.imgSrc}
                              style={{ width: "32px", height: "32px" }}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.name}
                            secondary={"x" + item.quantity}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              )}
              <div style={{ overflow: "auto", flexBasis: "50%" }}>
                <List dense>
                  {Object.keys(this.state.items)
                    .filter(
                      characterClass =>
                        characterClass !== "any" &&
                        this.state.items[characterClass].length > 0
                    )
                    .map(characterClass => {
                      return (
                        <React.Fragment key={characterClass}>
                          <Typography style={{ fontWeight: "bolder" }}>
                            {classLabelsAll[characterClass]}
                          </Typography>
                          {this.state.items[characterClass].map(item => {
                            return (
                              <ListItem key={item.itemModel}>
                                <ListItemAvatar>
                                  <img alt=''
                                    src={itemsPath +
                                      item.imgSrc}
                                    style={{ width: "32px", height: "32px" }}
                                  />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={item.name}
                                  secondary={"x" + item.quantity}
                                />
                              </ListItem>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                </List>
              </div>
            </div>
          )}
          <ItemsModal
            open={this.state.showItemsModal}
            handleClose={this.handleToggleItemsModal}
            itemsList={this.state.fullItemsList}
            eventItemsList={this.state.items}
            handleAddItem={this.handleAddItem}
            handleSubtractItem={this.handleSubtractItem}
            handleChangeItemQuantity={this.handleChangeItemQuantity}
            isRally={this.state.isRally}
            awardsLevels={this.state.awardsLevels}
            currentAwardTier={this.state.currentAwardTier}
          />
          <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />

              
          <Grid
            container
            justify="space-around"
            direction="column"
            alignItems="flex-start"
            spacing={2}
          >
            {this.state.collisionRallyList.length > 0 && (
              <Grid item>
                <Typography style={{ color: "rgb(206, 0, 0)" }}>
                  Rajdy kolidujące czasowo:
                </Typography>
                {this.state.collisionRallyList.map(rally => {
                  return (
                    <p
                      style={{ color: "rgb(157, 0, 0)" }}
                      key={rally.title}
                    >{`${rally.title}: od ${moment(rally.activationDate).format(
                      "lll"
                    )} do ${moment(rally.expiryDate).format("lll")}`}</p>
                  );
                })}
              </Grid>
            )}
            <Grid item style={{ textAlign: "left" }}>
              <Grid direction="column" container>
                {this.state.dateErrors.activationDate.map(
                  (dateError, index) => {
                    return (
                      <Grid item key={index}>
                        <DateErrorMessage
                          
                          style={{ color: "rgb(206, 0, 0)" }}
                        >
                          {dateError}
                        </DateErrorMessage>
                      </Grid>
                    );
                  }
                )}
              </Grid>

              {!this.state.isInstant && (
                <React.Fragment>
                  {/* <Typography>
                    Czas publikacji {this.state.isRally ? "rajdu:" : "misji:"}
                  </Typography> */}
                  {/* <TextField
                  onBlur={this.state.isRally && this.handleCheckRallyDates}
                    type="datetime-local"
                    value={this.state.activationDate}
                    onChange={this.handleActivationDateChange}
                  /> */}
                  <DateTimePicker
                    cancelLabel={'Anuluj'}
                    ampm={false}
                    label={` Czas publikacji ${this.state.isRally ? "rajdu:" : "misji:"}`}
                    value={this.state.activationDate}
                    onChange={this.handleActivationDateChange}
                    format="YYYY-MM-DD HH:mm"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <EventIcon/>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </React.Fragment>
              )}
              {this.state.collisionRallyList.length <= 0 &&
              <FormControlLabel
                style={{ marginLeft: "2rem" }}
                control={
                  <Checkbox
                    checked={this.state.isInstant}
                    onChange={this.handleInstantChange}
                  />
                }
                label="Publikuj natychmiast"
              />
              
              }
            </Grid>
            {this.state.isRally && (
              <Grid item style={{ textAlign: "left" }}>
                <Grid direction="column" container>
                  {this.state.dateErrors.startDate.map((dateError, index) => {
                    return (
                      <Grid item key={index}>
                        <DateErrorMessage
                          
                          style={{ color: "rgb(206, 0, 0)" }}
                        >
                          {dateError}
                        </DateErrorMessage>
                      </Grid>
                    );
                  })}
                </Grid>
                {!this.state.raidIsInstantStart && (
                  <React.Fragment>
                    {/* <Typography>Czas rozpoczęcia rajdu:</Typography>

                    <TextField
                      type="datetime-local"
                      value={this.state.startDate}
                      onChange={this.handleRaidStartTimeChange}
                    /> */}
                  <DateTimePicker
                    cancelLabel={'Anuluj'}
                    ampm={false}
                    label={"Czas rozpoczęcia rajdu:"}
                    value={this.state.startDate}
                    onChange={this.handleRaidStartTimeChange}
                    format="YYYY-MM-DD HH:mm"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <EventIcon/>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  </React.Fragment>
                )}
                {this.state.collisionRallyList.length <= 0 &&
                <FormControlLabel
                  style={{ marginLeft: "2rem" }}
                  control={
                    <Checkbox
                      checked={this.state.raidIsInstantStart}
                      onChange={this.handleRaidInstantStart}
                    />
                  }
                  label="Rozpocznij w momencie publikacji"
                />}
              </Grid>
            )}
            <Grid item style={{ textAlign: "left" }}>
              <Grid direction="column" container>
                {this.state.dateErrors.expiryDate.map((dateError, index) => {
                  return (
                    <Grid item key={index}>
                      <DateErrorMessage
                        
                        style={{ color: "rgb(206, 0, 0)" }}
                      >
                        {dateError}
                      </DateErrorMessage>
                    </Grid>
                  );
                })}
              </Grid>
              {!this.state.isPermanent && (
                <React.Fragment>
                  {/* <Typography>
                    Czas zakończenia {this.state.isRally ? "rajdu:" : "misji:"}
                  </Typography>

                  <TextField
                  onBlur={this.state.isRally && this.handleCheckRallyDates}
                    type="datetime-local"
                    value={this.state.expiryDate}
                    onChange={this.handleEndDateChange}
                  /> */}
                  <DateTimePicker
                    cancelLabel={'Anuluj'}
                    ampm={false}
                    label={` Czas zakończenia ${this.state.isRally ? "rajdu:" : "misji:"}`}
                    value={this.state.expiryDate}
                    onChange={this.handleEndDateChange}
                    format="YYYY-MM-DD HH:mm"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <EventIcon/>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </React.Fragment>
              )}
              {!this.state.isRally && (
                <FormControlLabel
                  style={{ marginLeft: "2rem" }}
                  control={
                    <Checkbox
                      checked={this.state.isPermanent}
                      onChange={this.handlePermanentChange}
                    />
                  }
                  label="Wydarzenie bezterminowe"
                />
              )}
            </Grid>
          </Grid>

          <Grid
            container
            justify="center"
            spacing={5}
            style={{ marginTop: "2rem" }}
          >
            <Grid item>
              <Button onClick={this.props.handleClose} color="secondary">
                Anuluj
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={this.handleSubmit}
                color="primary"
                variant="contained"
                disabled={this.state.disableSubmit}
              >
                {this.props.isEdit
                  ? "Zatwierdź edycję wydarzenia"
                  : "Dodaj wydarzenie"}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </MuiPickersUtilsProvider>
    );
  }
}

// const checkRallyDates = async (/*param*/) => {
//   const rallyList = [
//       {
//           activationDate: moment('2019-11-19T08:00:00.000+00:00'),
//           expiryDate: moment('2019-11-19T20:00:00.000+00:00')
//       },
//       {
//           activationDate: moment('2019-11-19T21:00:00.000+00:00'),
//           expiryDate: moment('2019-11-20T07:00:00.000+00:00')
//       },
//       {
//           activationDate: moment('2019-11-20T08:00:00.000+00:00'),
//           expiryDate: moment('2019-11-20T20:00:00.000+00:00')
//       },
//   ]

//   const rally = {
//       activationDate: moment('2019-11-19T20:03:00.000+00:00'),
//       expiryDate: moment('2019-11-19T20:02:00.000+00:00')
//   }

//   const newRallyStart = rally.activationDate.valueOf()
//   const newRallyEnd = rally.expiryDate.valueOf()

//   if(newRallyStart >= newRallyEnd){
//       console.log('swap dates, dummy boy')
//       return
//   }

//   let causingRallyList = []
//   await asyncForEach(rallyList, (rallyItem) => {
//       const existingRallyStart = rallyItem.activationDate.valueOf()
//       const existingRallyEnd = rallyItem.expiryDate.valueOf()

//       if(!((existingRallyStart < newRallyStart && existingRallyEnd < newRallyStart) || (existingRallyEnd > newRallyEnd && existingRallyStart > newRallyEnd))){
//           causingRallyList = [...causingRallyList, rallyItem] //assembling list of 'bad' rallies :<<
//       }
//   })

//   if(causingRallyList.length){
//       console.log(causingRallyList)
//   }else{
//       console.log('no problemo seniorita')
//   }
// }

export default EventCreator;
