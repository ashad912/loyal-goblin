import React from 'react'
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import NewEventModal from '../components/NewEventModal';

const AdminMissions = () => {

  const [showNewEventModal, setShowNewEventModal] = React.useState(false)

  const toggleEventModal = (e) => {
    setShowNewEventModal(prev => !prev)
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={toggleEventModal}>Stwórz nowe wydarzenie</Button>
      <Typography>Lista wydarzeń</Typography>
      <NewEventModal open={showNewEventModal} handleClose={toggleEventModal}/>
    </div>
  )
}

export default AdminMissions
