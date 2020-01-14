import React from 'react'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import IconButton from '@material-ui/core/IconButton';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";


const PaginationBar = (props) => {
    const {records, rowsPerPage, page, backendCountedRecords, handleSetRowsPerPage, handleNextPageButtonClick, handlePreviousPageButtonClick} = props
    const recordsLength = backendCountedRecords ? (backendCountedRecords) : (records.length)

    const rowsPerPageOrNo = page === parseInt(recordsLength / rowsPerPage) ? (recordsLength % rowsPerPage) : rowsPerPage
    const oneOrZero = recordsLength ? 1 : 0
    
    
    return(
        <React.Fragment>
            <Typography >Wyświetlane rekordy:</Typography>
            <FormControl >
            <Select
                autoFocus
                value={rowsPerPage}
                onChange={handleSetRowsPerPage}
                inputProps={{
                    name: 'rowsPerPage',
                    id: 'rowsPerPage',
                }}
                style={{
                    marginLeft: '0.5rem',
                    marginRight: '1.5rem'
                }}
            >
                
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                
            </Select>
            </FormControl>
            <Typography> {`${(page*rowsPerPage)+oneOrZero}-${(page*rowsPerPage)+rowsPerPageOrNo} z ${recordsLength}`}</Typography>
            <div style={{marginLeft: '1rem'}}>
            <IconButton
                onClick={handlePreviousPageButtonClick}
                disabled={page === 0}
                aria-label="Poprzednia strona"
                style={{padding: '0.5rem'}}
            >
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextPageButtonClick}
                disabled={page === parseInt(recordsLength / rowsPerPage)}
                aria-label="Kolejna strona"
                style={{padding: '0.5rem'}}
            >
                <KeyboardArrowRight />
            </IconButton>
            
            </div>
        </React.Fragment>
    )
}

export default PaginationBar