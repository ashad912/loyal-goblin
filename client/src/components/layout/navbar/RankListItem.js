import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Typography } from '@material-ui/core'
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";

import {palette} from 'utils/constants'

const StyledGrid = styled(Grid)`
    align-items: center;   
`

const StyledTypography = styled(Typography)`
    width: 100%;
    font-size: 0.7rem;
    text-align: ${props => props.center > 0 && 'center'};
    font-weight: ${props => props.bold > 0 && 'bold'};
`


const RankListItem = (props) => {
    const isHeader = props.header ? 1 : 0

    return (
        <React.Fragment>
            <ListItem style={{
                background: props.greyBackground && palette.background.lightGrey,
                borderBottom: props.borderLine && '1px solid black'
            }}>
                        
                <StyledGrid container >
                    <Grid item xs={1}>
                        <StyledTypography bold={isHeader}>{props.index}</StyledTypography>
                    </Grid>
                    <Grid item xs={2}>
                        {props.avatar}
                    </Grid>
                    <Grid item xs={5}>
                        <StyledTypography bold={isHeader} color={isHeader ? "inherit" : "primary"}>{props.name}</StyledTypography>
                    </Grid>
                    <Grid item xs={2}>
                        <StyledTypography bold={isHeader} center={1}>{props.level}</StyledTypography>
                    </Grid>
                    <Grid item xs={2}>
                        <StyledTypography bold={isHeader} center={1}>{props.experience}</StyledTypography>
                    </Grid>
                
                </StyledGrid>
                        
            </ListItem>
            {(props.withDivider) && <Divider/>}
        </React.Fragment>
    )
}

RankListItem.propTypes = {
    greyBackground: PropTypes.bool,
    borderLine: PropTypes.bool,
    header: PropTypes.bool,
    index: PropTypes.any.isRequired,
    avatar: PropTypes.element,
    name: PropTypes.string,
    level: PropTypes.any.isRequired,
    experience: PropTypes.any.isRequired,
    withDivider: PropTypes.bool,
}

export default RankListItem