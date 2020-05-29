import React from 'react'
import PropTypes from 'prop-types'

import { Avatar } from '@material-ui/core'

import { usersPath } from 'utils/definitions'

const createAvatarPlaceholder = (name) => {

    if (!name || !name.length) return ''
  
    
    if (!(/\s/.test(name))) {
        return name.charAt(0).toUpperCase()
    }
    
    const initials = name.split(" ").map(word => {
        return word.charAt(0)
    }).join('').toUpperCase()
  
    return initials.substring(0,2)
}


const AvatarWithPlaceholder = (props) => {
    const style = {
        ...props.style,
        width: props.width, 
        height: props.height,
    }
    
    if(!props.avatar){
        return(
           <Avatar 
                alt="avatar"
                style={{
                    ...style, 
                    fontSize: props.placeholder.fontSize,
                    margin: props.center && '0 auto'
                }}
            >
               {createAvatarPlaceholder(props.placeholder.text)}
            </Avatar> 
        )
    }

    return(
        <img 
            style={{
                ...style,
                borderRadius: props.square ? '0%' : '50%'
            }} 
            alt="avatar" 
            src={usersPath + props.avatar} 
        />
    )
}

AvatarWithPlaceholder.propTypes = {
    avatar: PropTypes.string,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    square: PropTypes.bool,
    center: PropTypes.bool,
    style: PropTypes.object,
    placeholder: PropTypes.shape({
        text: PropTypes.string,
        fontSize: PropTypes.string,
    }).isRequired
}

export default AvatarWithPlaceholder