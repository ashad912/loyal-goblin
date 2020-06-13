import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Grid from "@material-ui/core/Grid";
import Badge from "@material-ui/core/Badge";
import Typography from "@material-ui/core/Typography";
import { itemsPath } from '../../../../utils/constants'


const StyledBadge = styled(Badge)`
    margin-right: ${props => props.invisible ? '0rem' : '1rem'};
`

const MissionAmulets = ({mission, variant}) => {
    return(
        <Grid
            container
            direction="row"
            style={{marginBottom: '0', minHeight: '20px'}}
        >
            {mission.amulets && mission.amulets.length > 0 &&
                <Grid item style={{ display: "inline-flex", alignItems: 'center'}}>
                    <Typography 
                        variant={variant}
                        component="span"
                        style={{display: 'inline-flex', margin: '0 0.3rem 0 0'}}
                    >
                        Wymagane trofea:
                    </Typography>
                    
                    {mission.amulets.map(amulet => {
                        return (
                            <StyledBadge
                                key={amulet._id}
                                color="primary"
                                badgeContent={amulet.quantity}
                                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                                style={{transform: 'scale(0.9)' }}
                                invisible={amulet.quantity <= 1}
                            >
                                
                                <img
                                    style={{
                                        height: 20,
                                        width: 20,
                                        marginLeft: "0.1rem",
                                        marginRight: '0.2rem',
                                    }}
                                    src={`${itemsPath}${amulet.itemModel.imgSrc}`}
                                    alt="icon"
                                />
                                
                            </StyledBadge>
                        );
                    })}
                </Grid>
            }
        </Grid> 
    )
}

MissionAmulets.propTypes = {
    mission: PropTypes.shape({
        amulets: PropTypes.array.isRequired,
    }).isRequired,
    variant: PropTypes.string.isRequired
}

export default MissionAmulets

