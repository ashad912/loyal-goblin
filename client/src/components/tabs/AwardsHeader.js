import React from 'react'
import PropTypes from 'prop-types'
import Typography from "@material-ui/core/Typography";
import { PintoTypography } from "assets/fonts";

const AwardsHeader = ({experience, awards, expTitle, awardsTitle}) => {
    return(
        <React.Fragment>
            {experience > 0 &&
            <React.Fragment>
                <Typography style={{marginBottom: '0.5rem'}}>{expTitle}</Typography>
                <PintoTypography variant='h6' style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>
                    +{experience} PD
                </PintoTypography>
            </React.Fragment>  
            }
            {awards.length > 0 &&
                <Typography style={{marginBottom: '0.5rem'}}>{awardsTitle}</Typography>
            }
        </React.Fragment>
    )
}

AwardsHeader.propTypes = {
    experience: PropTypes.number.isRequired,
    awards: PropTypes.array.isRequired,
    expTitle: PropTypes.string.isRequired,
    awardsTitle: PropTypes.string.isRequired,
}

export default AwardsHeader