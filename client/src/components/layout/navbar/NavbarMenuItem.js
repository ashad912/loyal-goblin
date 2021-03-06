import React from 'react'
import PropTypes from 'prop-types'

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";

const NavbarMenuItem = (props) => {
    return(
        <MenuItem onClick={props.onClick}>
            <ListItemIcon>
                {props.icon}
            </ListItemIcon>
            <ListItemText>
                {props.action}
            </ListItemText>
        </MenuItem>
    )
}

NavbarMenuItem.propTypes = {
    icon: PropTypes.element.isRequired,
    action: PropTypes.element.isRequired,
    onClick: PropTypes.func
}

export default NavbarMenuItem