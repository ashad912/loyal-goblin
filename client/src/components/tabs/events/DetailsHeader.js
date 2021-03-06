import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { Typography } from '@material-ui/core'
import { palette} from '../../../utils/constants'
import {PintoTypography} from '../../../assets/fonts'
import DialogContent from "@material-ui/core/DialogContent";


const DetailsHeader = ({title, description, imgSrc}) => {
    return(
        <React.Fragment>
            <Grid
                container
                direction="column"
                style={{textAlign: 'left'}}
            >
                <Grid
                    container
                    direction="row"
                >        
                    <Grid item xs={9}>
                        <Grid
                            container
                            direction="column"      
                        >
                        <Grid item style={{marginBottom: '0.5rem'}}>
                            <Typography
                                component="span"
                                variant="h5"
                                
                            >
                                {title}
                            </Typography>
                        </Grid>
                        <Grid item /*style={{textAlign: 'justify'}}*/> 
                            <PintoTypography
                                component="p"
                                variant="body2"
                                style={{color: 'black'}}
                            >
                                {description}
                            </PintoTypography>
                        </Grid>
                        </Grid>   
                    </Grid> 
                    <Grid item xs={3} >
                        <Grid
                            container
                            direction="column"
                        >
                            <Grid item style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Avatar alt="avatar" style={{width: '3.5rem', height: '4rem'}} src={imgSrc} />
                            </Grid>
                        </Grid>
                    </Grid>
                    

                </Grid>
            </Grid>
        </React.Fragment>
    )
}

DetailsHeader.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imgSrc: PropTypes.string.isRequired,
}

export default DetailsHeader