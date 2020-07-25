import React from 'react'
import PropTypes from 'prop-types'


const NavbarMenu = (props) => {
    return(
        <div 
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: '45vw',
                maxWidth: '200px',
                height: '100%',
                padding: '1rem 0.5rem'
            }}
        >
            {props.children}
        </div> 
    )
}

NavbarMenu.propTypes = {
    children: PropTypes.node.isRequired
}

export default NavbarMenu