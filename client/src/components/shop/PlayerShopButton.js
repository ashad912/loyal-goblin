import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import {usersPath} from '../../utils/definitions'
import AvatarWithPlaceholder from 'components/AvatarWithPlaceholder'

const PlayerShopButton = ({id, avatar, name, active, handleClick}) => {

  // let initials = name.split(" ").map(word => {
  //     return word.charAt(0)
  // })
  return (
    <Chip
    style={{margin: '0.1rem'}} 
    avatar={
      <AvatarWithPlaceholder 
        avatar={avatar}
        width="32px"
        height="32px"
        placeholder={{
            text: name,
        }}
      /> 
    }
    label={name}
    onClick={(e) => handleClick(e, id)}
    color={active ? "primary" : "default"} 
  />
  )
}

export default PlayerShopButton
