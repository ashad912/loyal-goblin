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
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
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



const StyledPaper = styled(Paper)`
    padding: 0.5rem
    border: 1px solid #eeeeee
`


const FileInputWrapper = styled.div`
  position: relative;
  background: red;
  height: 2.5rem;
  width: 10rem;
  margin: 0.5rem 0 0 0;
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

const StyledFormControl = styled(FormControl)`
  min-width: 10rem;
`
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

const productCategories = ['shots', 'drinks', 'beer', 'food', 'alco-free']

class NewProductCreator extends Component {
  state = {
    name: '',
    description: '',
    icon: "",
    price: "",
    category: productCategories[0],  
    formError: {
        price: undefined,
    }
  };



  handleIconChange = e => {
    this.setState({ icon: URL.createObjectURL(e.target.files[0]) });
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


    callbacksAndValidation = (fieldName, fieldValue, prevFieldValue) => {
    
    switch(fieldName) {
      case 'price':
        let valueValid = true
        let valueError = ''

        if(fieldValue.length > 0){
          valueValid = fieldValue.trim().match(/^\d+(\.\d{1,2})?$/);
          valueError = valueValid ? undefined : 'Niepoprawna wartość!'
        }else{
          valueValid = true
          valueError = 'Pole wymagane!'
        }
        this.setState({
          formError: {
              ...this.state.formError,
              price: valueError
          },
          
        });
        break
      default:
        break
    }


  }

  handleSubmit = () => {
    //valdidate and send data
    this.props.handleClose();
  };

 

  componentDidUpdate(){
      //console.log(this.state.class)
  }

  render() {
    
    const convertToCategoryLabel = (categoryType) => {
      const categoryObjects = [
        {
          perk: 'shots',
          label: 'Szoty'
        },
        {
          perk: 'drinks',
          label: 'Napoje',
        },
        {
          perk: 'beer',
          label: 'Piwo'
        },
        {
          perk: 'food',
          label: 'Jedzenie'
        },
        {
          perk: 'alco-free',
          label: 'Bezalkoholowe',
        }
      ]
    
      const index = categoryObjects.findIndex((categoryObject) => {return categoryObject.perk === categoryType})
    
      if(index !== -1){
        return categoryObjects[index].label
      }
      return null
    }

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Button>{"< Powrót do panelu produktów"}</Button>
        <Container style={{margin: '1rem 0 0 0'}}>
        <Grid container spacing={5} style={{minHeight: '80px'}}>
            <Grid item xs={2}></Grid>
            <Grid item xs={4} style={{textAlign: 'left'}}>
                <StyledFormControl >
                    <InputLabel shrink={true} htmlFor="category">Kategoria</InputLabel>
                    <Select
                        autoFocus
                        value={this.state.category}
                        onChange={this.handleChangeNameValue}
                        inputProps={{
                            name: 'category',
                            id: 'category',
                        }}
                    >
                        {productCategories.map((category) => {
                            return(
                                <MenuItem value={category}>{convertToCategoryLabel(category)}</MenuItem>
                            )
                        })}
                    </Select>
                </StyledFormControl>
            </Grid>
            <Grid item xs={4}>
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
            </Grid>
          </Grid>
          <Grid container spacing={5}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} style={{textAlign: 'left'}}>
            <TextField
              name="name"
              margin="dense"
              label={`Nazwa produktu`}
              type="text"
              fullWidth
              onChange={this.handleChangeNameValue}
            />
            <TextField
              name="description"
              margin="dense"
              label={`Opis produktu`}
              type="text"
              fullWidth
              multiline
              rows={2}
              rowsMax={5}
              onChange={this.handleChangeNameValue}
            />
            <TextField
              style={{width: '30%'}}
              name="price"
              margin="dense"
              label={`Cena produktu [PLN]`}
              type='text'
              error={this.state.formError.price}
              helperText={this.state.formError.price ? (this.state.formError.price) : ("Np. 7, 10.5, 1.25")}
              onChange={this.handleChangeNameValue}
            />
            
          </Grid>
         </Grid>
        </Container>
      </MuiPickersUtilsProvider>
    );
  }
}

export default NewProductCreator;
