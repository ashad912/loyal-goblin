import React  from 'react'
import VisibilitySensor from 'react-visibility-sensor'
import avatarTemp from '../../assets/statki.svg'

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { sizing } from '@material-ui/system';



const createTempList = () => {
    return [
        {
            id: 0,
            title: 'Mission1',
            avatar: {avatarTemp},
            requiredPlayers: 4,
            description: 'Super important mission. You need have things and attributes, as always loool xd',
            amulets: [
                {name: 'diamond', img: 'altImg'},
                {name: 'pearl', img: 'altImg'},
            ]
        },
        {
            id: 1,
            title: 'Mission2',
            avatar: {avatarTemp},
            requiredPlayers: 3,
            description: 'Super important mission. You need have things and attributes, as always loool xd',
            amulets: [
                {name: 'sapphire', img: 'altImg'},
                {name: 'diamond', img: 'altImg'},
                {name: 'pearl', img: 'altImg'},
            ]
        },
        {
            id: 2,
            title: 'Mission3',
            avatar: {avatarTemp},
            requiredPlayers: 4,
            description: 'Super important mission. You need have things and attributes, as always loool xd',
            amulets: [
                {name: 'diamond', img: 'altImg'},
                {name: 'pearl', img: 'altImg'},
            ]
        },
        {
            id: 3,
            title: 'Mission4',
            avatar: {avatarTemp},
            requiredPlayers: 3,
            description: 'Super important mission. You need have things and attributes, as always loool xd',
            amulets: [
                {name: 'sapphire', img: 'altImg'},
                {name: 'diamond', img: 'altImg'},
                {name: 'pearl', img: 'altImg'},
            ]
        },
        {
            id: 4,
            title: 'Mission5',
            avatar: {avatarTemp},
            requiredPlayers: 4,
            description: 'Super important mission. You need have things and attributes, as always loool xd',
            amulets: [
                {name: 'diamond', img: 'altImg'},
                {name: 'pearl', img: 'altImg'},
            ]
        },
        {
            id: 5,
            title: 'Mission6',
            avatar: {avatarTemp},
            requiredPlayers: 3,
            description: 'Super important mission. You need have things and attributes, as always loool xd',
            amulets: [
                {name: 'sapphire', img: 'altImg'},
                {name: 'diamond', img: 'altImg'},
                {name: 'pearl', img: 'altImg'},
            ]
        },

    ]
}


const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      //maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    block: {
      display: 'block',
    },
    inline: {
      display: 'inline',
    },
  }));


export default function Events() {
    const classes = useStyles();


    const missionListData = createTempList() //returned from backend

    //for better perfomance uses VisibilitySensor to load only visible (or partly visible) elements
    //to work need fixed listem item size (which is ok, i believe)
    const missionList = missionListData ? (
        missionListData.map(mission => {
            return(
                <VisibilitySensor partialVisibility key={mission.id}>
                {({isVisible}) =>
                    <div>{isVisible ? ( /*inVisible defined only inside div with is fucking kurwa crazy */
                        <ListItem style={{height: 200}} alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt="avatar" src={mission.avatar.avatarTemp} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {mission.title}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {`  Players required: ${mission.requiredPlayers}`}
                                    </Typography>
                                    </React.Fragment>
                                }
                                secondary={
                                    <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.block}
                                        color="textPrimary"
                                    >
                                        {mission.description}
                                    </Typography>
                                    {mission.amulets ? (mission.amulets.map(amulet => `${amulet.name} `)):(null)}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>   
                    ) : (<div className='mock-item'>"Loading ..."</div>)   /*null makes all list invisible... */
                    }
                    </div>
                }   
                </VisibilitySensor>
            )
        })
    ) : ( null )

    
    return (

        <React.Fragment>
        <List className={classes.root}>
            {missionList}
        </List>
    
        </React.Fragment>
      
    )
}
