import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { ListItem, Grid, Typography, Divider } from '@material-ui/core'
import { itemsPath } from 'utils/definitions'



const StatsListItem = ({ text, image, counter }) => {
    return (
        <Fragment>
            <ListItem style={{
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem'
            }}>
                <Grid container style={{ alignItems: 'center' }}>
                    <Grid item xs={11} style={{display: 'flex', alignItems: 'center'}}>
                        <Typography>{text}</Typography>
                        {image && <img alt="item" src={itemsPath + image} style={{ width: '20px', height: '20px', padding: '0 0.2rem' }} />}
                    </Grid>
                    <Grid item xs={1}>
                        <Typography style={{ fontWeight: 'bold', textAlign: 'center' }}>{counter}</Typography>
                    </Grid>
                    
                </Grid>
            </ListItem>
            <Divider/>
        </Fragment>
    )
}

StatsListItem.propTypes = {
    text: PropTypes.string.isRequired,
    image: PropTypes.string,
    counter: PropTypes.number.isRequired
}

export default StatsListItem