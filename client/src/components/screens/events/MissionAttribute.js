import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {uiPaths, palette} from '../../../utils/definitions'



const RequiredAttribute = styled(Typography)`
    margin: 0 0.5rem 0 0;
    color: ${props => props.attr ? palette.primary.main : 'red' } ;
`

const MissionAttribute = ({attribute, appropriate, total, required, variant }) => {
    return(
        <Grid item xs={3} style={{display: 'flex', direction: 'column', alignItems: 'center'}}>
            <img style= {{height: '1.2rem', width: '1.2rem', marginRight: '0.25rem'}} src={uiPaths[attribute]}/>
            <RequiredAttribute variant={variant} attr={appropriate ? 1:0} >{`${total}/${required}`}</RequiredAttribute>
        </Grid>
    )
}

MissionAttribute.propTypes = {
    attribute: PropTypes.string.isRequired,
    appropriate: PropTypes.bool.isRequired,
    total: PropTypes.number.isRequired,
    required: PropTypes.number.isRequired,
    variant: PropTypes.string.isRequired,
}

export default MissionAttribute