import React from 'react'
import PropTypes from 'prop-types'

import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import Typography from '@material-ui/core/Typography';

const MissionListHeader = ({missionListLength, activeMissionId, handleRefresh}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton
                onClick={handleRefresh}
                aria-label="Odśwież"
                style={{ padding: '0.5rem' }}
            >
                <RefreshIcon />
            </IconButton>
            <Typography variant="h6">
                {missionListLength ? (activeMissionId ? 'Aktywna misja' : 'Dostępne misje') : 'Brak dostępnych misji!'}
            </Typography>
        </div>
    )
}

MissionListHeader.propTypes = {
    missionListLength: PropTypes.number.isRequired,
    activeMissionId: PropTypes.string,
    handleRefresh: PropTypes.func.isRequired
}

export default MissionListHeader