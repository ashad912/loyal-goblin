import React from 'react'
import PropTypes from 'prop-types'
import List from "@material-ui/core/List";
import AwardListItem from '../AwardListItem'

const AwardsList = ({awards, style}) => {
    return(
        <React.Fragment>
            {awards.length > 0 &&
                <List 
                    component="nav" 
                    style={style}
                >
                        {awards.map(award => {
                            return (
                                <AwardListItem key={award.itemModel._id} item={award} />
                            );
                        })}
                </List>  
            }
        </React.Fragment>
    )
}

AwardsList.propTypes = {
    awards: PropTypes.array.isRequired,
    style: PropTypes.object
}

export default AwardsList