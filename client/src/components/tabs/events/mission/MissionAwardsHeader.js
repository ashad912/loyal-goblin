import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


const MissionAwardsHeader = ({variant}) => {
    return(
        <Grid container direction="column">
          <Grid container direction="row">
            <Grid item>
              <Typography
                component="span"
                variant={variant}
                color="textPrimary"
                style={{ fontWeight: "bold" }}
              >
                Nagrody
              </Typography>
            </Grid>
          </Grid>
        </Grid>
    )
}

MissionAwardsHeader.propTypes = {
    variant: PropTypes.string.isRequired
}

export default MissionAwardsHeader