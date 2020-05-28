import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Avatar from "@material-ui/core/Avatar";

import RankListItem from "./RankListItem";
import AvatarWithPlaceholder from  'components/AvatarWithPlaceholder'

import { getRankedUsers } from "store/actions/profileActions";

import {designateUserLevel} from 'utils/methods'
import {createAvatarPlaceholder} from "utils/methods";
import {usersPath, palette} from 'utils/definitions'


const RankDialog = props => {
  
    const [users, setUsers] = React.useState([])
    //const [myUserIndex, setMyUserIndex] = React.useState(0)

    React.useEffect(() => {
        const fetchRankedUsers = async () => {
            const data = await getRankedUsers()
            //setMyUserIndex(data.userIndex)

            const thisUser = {
                index: data.userIndex + 1,
                name: props.profile.name,
                avatar: props.profile.avatar,
                experience: props.profile.experience,
            }
            setUsers([thisUser, ...data.users])
        }

        fetchRankedUsers()
    }, [])


    return (
        <Dialog   maxWidth="xl" fullWidth open={props.open} onClose={props.handleClose} PaperProps={{style: {width: '100%', margin: '1rem', maxHeight: '70vh', height: '70vh'}}}>
        <DialogTitle style={{padding: '1rem 1rem 0 1rem'}}>TopGoblin</DialogTitle>
        <DialogContent style={{padding: '1rem 1rem'}}>
            
            <List style={{  padding: '0' }} align="flex-start">
                <RankListItem 
                    key='title'
                    header
                    index="No."
                    name="Użytkownik"
                    level="Poz."
                    experience="PD"
                />
                {users.map((user, index) => {
                    return (
                        <RankListItem 
                            key={index}
                            greyBackground={index > 0 && index % 2 === 0}
                            borderLine={index === 0}
                            index={user.index ? user.index : index}
                            avatar={
                                <React.Fragment>
                                    <AvatarWithPlaceholder 
                                        avatar={user.avatar}
                                        width="16px"
                                        height="16px"
                                        square
                                        placeholder={{
                                            text: user.name,
                                            fontSize: '0.6rem'
                                        }}
                                    />
                                     
                                </React.Fragment>
                            }
                            name={user.name}
                            level={designateUserLevel(user.experience)}
                            experience={user.experience}
                            withDivider={index !== 0 && index + 1 !== users.length}
                        />
                    );
                })}
            </List>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleClose} color="primary">
                Zamknij
            </Button>
        </DialogActions>
        </Dialog>
    );
};

export default RankDialog;