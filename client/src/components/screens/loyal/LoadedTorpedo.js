import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Button from "@material-ui/core/Button";
import styled, {keyframes} from 'styled-components'
import {itemsPath, palette} from '../../../utils/definitions'
import { PintoTypography, PintoSerifTypography } from "../../../utils/fonts";

const glowReady = keyframes`
  0%{
    box-shadow: 0px 0px 4px 0px ${palette.primary.main}
  }
  100%{
    box-shadow: 0px 0px 10px 1px ${palette.primary.main}
  }
`

const glowWarning = keyframes`
  0%{
    box-shadow: 0px 0px 4px 0px ${palette.secondary.main}
  }
  100%{
    box-shadow: 0px 0px 10px 1px ${palette.secondary.main}
  }
`

const StyledListItem = styled(ListItem)`
  padding: 12px 0;
`
const LaunchButton = styled(Button)`
  animation-name: ${props => props.disabled ? glowWarning : glowReady};
  animation-duration: 1s;
  animation-direction: alternate;
  animation-iteration-count: infinite;
  transition: all 0.2s ease-out;
`


const LoadedTorpedo = (props) => {
    
    const handleShoot = () => {
        props.handleShoot()
    }
    
    const torpedo = props.torpedo;
  
    const torpedoField = props.fields.find(field=>{
      return field.name === torpedo.itemModel.name
    })
    //console.log(torpedo)
  
  
    return (
      <StyledListItem
        button
        key={torpedo._id}
        alignItems="flex-start"
        onClick={handleShoot}
      >
        <ListItemAvatar>
          <img
            style={{ width: "32px", height: "32px" }}
            alt={torpedo.itemModel.name}
            src={`${itemsPath}${torpedo.itemModel.imgSrc}`}
          />
        </ListItemAvatar>
        <ListItemText
          disableTypography
          primary={<PintoSerifTypography>{torpedo.itemModel.name}</PintoSerifTypography>}         
          secondary={<PintoTypography>{torpedo.itemModel.description}</PintoTypography>}
        />
        <ListItemIcon>
          <LaunchButton color="primary" disabled={props.inProgress || torpedoField.pressed}>
            {!props.inProgress ? ('Strzelaj!') : ('Uwaga!')}
          </LaunchButton>
        </ListItemIcon>
        
      </StyledListItem>
    );

}

export default LoadedTorpedo