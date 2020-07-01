import React from 'react'
import PropTypes from 'prop-types'

import Grid from "@material-ui/core/Grid";

import MissionBasicInfo from './MissionBasicInfo';


const MissionInfo = ({mission}) => {
    return (
        <Grid
            container
            direction="column"
            style={{ padding: "1rem 0 1.5rem 0", textAlign: "left" }}
        >
            <MissionBasicInfo mission={mission} />
        </Grid>
    )
}

MissionInfo.propTypes = {
    mission: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        imgSrc: PropTypes.string.isRequired,
        unique: PropTypes.bool.isRequired
    })
}

export default MissionInfo
