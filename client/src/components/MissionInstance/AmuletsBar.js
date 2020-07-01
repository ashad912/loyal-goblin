import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { itemsPath } from 'utils/constants'

const Bar = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: baseline;
  margin: 0 0rem 0rem 0rem;
`

const StyledItemIcon = styled.img`
  margin: 0 0.1rem 0 0;
  height: 1rem;
  width: 1rem;
`
const StyledItemsIndicator = styled.span`
  font-size: 10px;
  color: ${(props) => {
        const green = props.inBox === props.required
        const red = props.inBox > props.required
        if (red) {
            return ('red')
        } else if (green) {
            return ('green')
        } else {
            return ('black')
        }
    }
    };
    margin-right: 0.5rem;
`

const AmuletsBar = (props) => {
    return (
        <Grid
            container
            direction="row"
            style={{ textAlign: "left" }}
        >
            <Grid item xs={3}></Grid>
            <Grid item xs={9}>
                <Bar>

                    {props.amulets.map((amulet) => {
                        return (
                            <React.Fragment key={amulet.itemModel._id}>

                                <StyledItemIcon src={`${itemsPath}${amulet.itemModel.imgSrc}`} />
                                <StyledItemsIndicator required={amulet.quantity} inBox={amulet.inBox}>
                                    <Typography style={{ fontSize: '0.8rem' }}>
                                        {` ${amulet.inBox}/${amulet.quantity}`}
                                    </Typography>
                                </StyledItemsIndicator>
                                {/* {statusIcon(amulet.readyStatus)} */}
                            </React.Fragment>
                        )
                    })}

                </Bar>
            </Grid>
        </Grid>


    )
}

AmuletsBar.propTypes = {
    amulets: PropTypes.arrayOf(
        PropTypes.shape({
            itemModel: PropTypes.shape({
                imgSrc: PropTypes.string.isRequired
            }),
            quantity: PropTypes.number.isRequired,
            inBox: PropTypes.number.isRequired,
            readyStatus: PropTypes.bool.isRequired
        })
    )
}


export default AmuletsBar