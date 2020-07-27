import React from 'react'
import { useSelector } from 'react-redux'

export default (props) => {

    const fullHeightCorrection = useSelector(state => state.layout.navbarHeight + state.layout.footerHeight)

    return (
        <div style={{ width: '100vw', height: `calc(100vh - ${fullHeightCorrection}px)` }}>
            {props.children}
        </div>
    )
}