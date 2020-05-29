import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";

import RankListItem from "./RankListItem";
import AvatarWithPlaceholder from 'components/AvatarWithPlaceholder'

import { getRankedUsers } from "store/actions/profileActions";

import { getUserLevel } from 'utils/functions'


const RankDialog = props => {

    const [users, setUsers] = React.useState([])

    React.useEffect(() => {
        const fetchRankedUsers = async () => {
            const data = await getRankedUsers()

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
        <Dialog maxWidth="xl" fullWidth open={props.open} onClose={props.handleClose} PaperProps={{ style: { width: '100%', margin: '1rem', maxHeight: '70vh', height: '70vh' } }}>
            <DialogTitle style={{ padding: '1rem 1rem 0 1rem' }}>TopGoblin</DialogTitle>
            <DialogContent style={{ padding: '1rem 1rem' }}>

                <List style={{ padding: '0' }} align="flex-start">
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
                                }
                                name={user.name}
                                level={getUserLevel(user.experience)}
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