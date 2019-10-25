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

import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import PerkModal from "./PerkModal";


const StyledPaper = styled(Paper)`
    padding: 0.5rem;
    border: 1px solid #eeeeee;
`


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

const StyledBox = styled(Box)`
    margin: 0.5rem 0.5rem 0.5rem 0.5rem;
    text-align: center;

`
const HeadersContainer = styled.div`
    margin: 0.5rem 0.5rem 0.5rem 0.5rem;
    padding: 0.25rem 1rem 0.25rem 1rem;
    
    
`
const AmuletIcon = styled.img`
  width: 32px;
`;

const AmuletList = styled(List)`
max-height: 30vh;
max-width: 30vw;
overflow-y: auto;
border: 1px solid grey;
`

const itemClasses = ['Wojownik', 'Mag', 'Łotrzyk', 'Kleryk']
const days = [null, 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela']

const itemTypesLabels = {
  amulet: 'Amulet',
  feet: 'Buty',
  hands: 'Dłonie',
  head: 'Głowa',
  chest: 'Korpus',
  mixture: 'Mikstura',
  legs: 'Nogi',
  ring: 'Pierścień',
  torpedo: 'Torpeda',
  scroll: 'Zwój',
}

class NewItemCreator extends Component {
  state = {
    name: '',
    description: '',
    icon: "",
    class: null,
    modifyingIndex: null,
    showPerkModal: false,
    perks: []
  };

  componentDidMount = () => {
      const item = this.props.item
      
      console.log(item)
      this.setState({
        _id: item._id,
        name: item.name,
        description: item.description,
        type: item.type,
        class: item.class,
        perks: item.perks,
        icon: (item.imgSrc.includes('blob') || item.imgSrc.includes('data:image')) ? (item.imgSrc) : (require("../../../assets/icons/items/" + item.imgSrc))
      })
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
    this.setState({ icon: URL.createObjectURL(e.target.files[0]) });
  };

  handleToggleClassItem = e => {
    
    this.setState(prevState => {
      return { classItem: !prevState.classItem,
                class: prevState.class ? null : itemClasses[0]
             };
    });
  };

  handleChangeNameValue = (e) => {
    
    const name = e.target.name
    const value = e.target.value 
    console.log(name, value)
    this.setState({
        [name]: value
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

  saveItem = () => {
      const item = {
        _id: this.state._id,
        name: this.state.name,
        description: this.state.description,
        type: this.state.type,
        class: this.state.class,
        perks: this.state.perks,
        imgSrc: this.state.icon
      }

      this.props.updateItems(item)
  }

  componentDidUpdate(){
      //console.log(this.state.class)
  }

  render() {
    const getEndHour = (startHour, length) => {
      return (startHour + length) % 24
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
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Button onClick={this.props.handleClose}>{"< Powrót do panelu przedmiotów"}</Button>
        <Container>
          <Grid container spacing={5}>
          <Grid item xs={12} style={{textAlign: 'left'}}>
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
                    {Object.keys(itemTypesLabels).map((itemTypeKey) => {
                        return(
                            <MenuItem value={itemTypeKey}>{itemTypesLabels[itemTypeKey]}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
            </Grid>
          <Grid item xs={6} >
            <TextField
              value={this.state.name}
              name="name"
              margin="dense"
              label={`Nazwa przedmiotu`}
              type="text"
              fullWidth
              onChange={this.handleChangeNameValue}
            />
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
                            {itemClasses.map((itemClass) => {
                                return (
                                    <MenuItem value={itemClass}>{itemClass}</MenuItem>
                                )
                            })}
                        </Select>
                  </FormControl>
                ) : (
                    null
                )}
            
          </div>
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
            
          {this.state.perks.length ? (
            
              <Grid item xs={12}>
              <StyledPaper elevation={0}>
                  <HeadersContainer>
                      <Typography style={{width: '100%', color: 'rgba(0, 0, 0, 0.54)', fontSize: '0.8rem'}}>
                      <Grid container>
                        <Grid item xs={3}>
                          Typ efektu
                        </Grid>
                        <Grid item xs={2}>
                          Efekt
                        </Grid>
                        <Grid item xs={1}>
                          Zakres zniżki
                        </Grid>
                        <Grid item xs={3}>
                          {'Czas(y) działania efektu'}
                        </Grid>
                        <Grid item xs={1}>
                        </Grid>
                        <Grid item xs={2}>
                        </Grid>
                      </Grid>
                      </Typography>
                  </HeadersContainer>
                  <List dense style={{maxHeight: '8rem', overflow: 'auto', width: '100%'}}>
                    
                      {this.state.perks.map((perk, index) => {
                          console.log(perk)
                          return(
                            <StyledBox border={1} borderColor="primary.main">
                              <ListItem>
                                <Typography style={{width: '100%', fontSize: '0.8rem', textAlign: 'center'}} >
                                <Grid container>
                                  <Grid item xs={3}>
                                    {convertToPerkLabel(perk.perkType)}
                                  </Grid>
                                  <Grid item xs={2}>
                                    {perk.value}
                                  </Grid>
                                  <Grid item xs={1}>
                                    {perk.target ? (perk.target.name ? (perk.target.name) : (perk.target)) : (null)}
                                  </Grid>
                                  <Grid item xs={3}>
                                    {perk.time.length ? (
                                      <React.Fragment>
                                        {perk.time.map((period)=>(
                                        <Grid container style={{justifyContent: 'center'}}>
                                          <Grid item>
                                            {`${days[period.startDay]}`}
                                          </Grid>
                                          {(period.startHour === 12 && period.lengthInHours === 24) ? (
                                            <Grid item>
                                              {`, ${period.startHour}:00 - ${getEndHour(period.startHour, period.lengthInHours)}:00`}
                                            </Grid>
                                          ) : (
                                            null
                                          )}
                                        </Grid>
                                        ))}
                                      </React.Fragment>
                                    ) : (
                                      <span>Stały</span>
                                    )}
                                    
                                  </Grid>
                                
                                
                                  <Grid item xs={1}>
                                    
                                  </Grid>
                                  <Grid item xs={2} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button
                                        style={{marginRight: '0.5rem', height: '2.5rem'}}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => this.handleModifyPerk(index)}>
                                          <CreateIcon />
                                    </Button>
                                    <Button
                                      style={{height: '2.5rem'}}
                                      variant="contained"
                                      color="primary"
                                      onClick={() => this.handleDeletePerk(index)}>
                                          <DeleteIcon />
                                    </Button>
                                  </Grid>
                                </Grid>
                                </Typography>
                              </ListItem>
                              
                              
                              </StyledBox>
                          )
                      })}
                  </List>
                  </StyledPaper>
                  </Grid>
                
                
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
