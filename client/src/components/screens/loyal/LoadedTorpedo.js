import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Button from "@material-ui/core/Button";
import styled from 'styled-components'
import {itemsPath} from '../../../utils/paths'

const StyledListItem = styled(ListItem)`
    marginBottom: 0.2rem;
    border: 1px solid rgb(63, 81, 181);
`



const LoadedTorpedo = (props) => {
    
    const handleShoot = () => {
        props.handleShoot()
    }
    
    const torpedo = props.torpedo;
  
    console.log(torpedo)
  
  
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
          primary={torpedo.itemModel.name}
          secondary={<span>{torpedo.itemModel.description}</span>}
        />
        <ListItemIcon>
          <Button color="primary" disabled={props.inProgress}>
            {!props.inProgress ? ('Strzelaj!') : ('Uwaga!')}
          </Button>
        </ListItemIcon>
        
      </StyledListItem>
    );

}

export default LoadedTorpedo