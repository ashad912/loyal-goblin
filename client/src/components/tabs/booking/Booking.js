import React from 'react'
import {PintoTypography} from '../../../assets/fonts'
import {palette} from '../../../utils/constants'

const Booking = (props) => {

   

    return(
        <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center',  minHeight: props.fullHeight}}>
        <PintoTypography style={{color:palette.background.darkGrey, fontSize:'2rem'}}>Rezerwacje w budowie!</PintoTypography>
        </div>
    )
}

export default Booking