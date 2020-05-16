import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import InputBase from '@material-ui/core/Input'

const FileInputWrapper = styled.div`
  position: relative;
  background: red;
  height: ${props => props.twoLines ? '3.7rem' : '2.5rem'};
  width: 10rem;
  margin: 1rem 0 1.3rem 0;
`;

const HiddenFileInput = styled(({...otherProps }) => (
    <InputBase classes={{input: 'input'}} {...otherProps}  />
))`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  height: ${props => props.twoLines ? '3.7rem' : '2.5rem'};
  width: ${props => props.wide ? '20rem':'10rem'};
  user-select: none; 
  .input {
    height: ${props => props.twoLines ? '3.7rem' : '2.5rem'};
    cursor: pointer;
  }
`;

const FileInputButton = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  height: ${props => props.twoLines ? '3.7rem' : '2.5rem'};
  width: ${props => props.wide ? '20rem':'10rem'};
`;


const ImageWrapper = ({view, text, secondaryText, viewName, fileName, accept, error, imageChange, wide}) => {
    
    
    return(
        <Grid container spacing={2}>
            <Grid item>
                <FileInputWrapper twoLines={secondaryText}>
                    <FileInputButton variant="contained" color="primary" twoLines={secondaryText} wide={wide ? 1:0}>
                        {view ? `Zmień ${text}` : `Dodaj ${text}`}
                        <br/>
                        {secondaryText}
                    </FileInputButton>
                <HiddenFileInput
                    type="file"
                    onChange={(e) => imageChange(e, viewName, fileName)}
                    inputProps={{accept}}
                    twoLines={secondaryText}
                    wide={wide ? 1:0}
                />
                
                </FileInputWrapper>
                {error && <Typography style={{color: 'red', fontSize: '0.8rem'}}>{error}</Typography>}
            </Grid>
            <Grid
                item
                    style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: wide && '10rem'
                }}
            >
                <img alt='' src={view} style={{ width: "64px", height: '64px' }} />
            </Grid>
        </Grid>  
        
    )
}

ImageWrapper.propTypes = {
    view: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    secondaryText: PropTypes.string,
    viewName: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    accept: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
    imageChange: PropTypes.func.isRequired,
    wide: PropTypes.bool
}

export default ImageWrapper