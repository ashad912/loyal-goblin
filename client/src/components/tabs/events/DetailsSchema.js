import React from 'react'
import PropTypes from 'prop-types'
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import {palette} from 'utils/constants'


const DetailsSchema = (props) => {
    return(
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            fullWidth
            style={{margin: '-40px', zIndex: 1500}}
            maxWidth="xs"
        >
            <div style={{backgroundColor: palette.primary.main, color: 'white'}}>
                <DialogContent style={{padding: '2rem 1rem', maxHeight: '19vh'}}>
                    {props.header}
                </DialogContent>
            </div>

            <DialogContent style={{padding: '0.5rem 1rem', minHeight: props.minHeaderHeight}}>
                {props.requirements}
                {props.awardsHeader}    
            </DialogContent>
            
            <DialogContent style={{padding: '0.5rem 1rem'}}>
                {props.awardsSections}
            </DialogContent>
            {props.awardsFooter}
        
            <DialogActions style={{justifyContent: props.footerJustify}}>
                {props.footer}
            </DialogActions>
        </Dialog>
    )
    
}


DetailsSchema.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    header: PropTypes.element.isRequired,
    minHeaderHeight: PropTypes.string.isRequired,
    requirements: PropTypes.element,
    awardsHeader: PropTypes.element.isRequired,
    awardsSections: PropTypes.element.isRequired,
    awardsFooter: PropTypes.element,
    footer: PropTypes.element.isRequired,
    footerJustify: PropTypes.string,
}

export default DetailsSchema