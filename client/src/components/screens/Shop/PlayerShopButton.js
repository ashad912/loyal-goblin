import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import {usersPath} from '../../../utils/definitions'

const PlayerShopButton = ({id, avatar, name, active, handleClick}) => {

    let initials = name.split(" ").map(word => {
        return word.charAt(0)
    })
  return (
    <Chip
    style={{margin: '0.1rem'}} 
    avatar={avatar? <Avatar alt="Avatar" src={(usersPath + avatar)} /> : <Avatar>{initials}</Avatar> }
    label={name}
    onClick={(e) => handleClick(e, id)}
    color={active ? "primary" : "default"} 
  />
  )
}

export default PlayerShopButton
