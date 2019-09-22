import React, {useEffect, useState} from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import avatarTemp from '../../../../assets/board/statki.svg'

const createTempPartyList = () => {
    return [
        {
            inRoom: true,
            user: {
                _id: 1,
                name: 'user1',
                avatar: avatarTemp,
            }
        },
        {
            inRoom: true,
            user: {
                _id: 2,
                name: 'user2',
                avatar: avatarTemp,
            }
        },
        {
            inRoom: true,
            user: {
                _id: 3,
                name: 'user3',
                avatar: avatarTemp,
            }
        },
        {
            inRoom: true,
            user: {
                _id: 4,
                name: 'user4',
                avatar: undefined,
            }
        },
        {
            inRoom: true,
            user: {
                _id: 5,
                name: 'user5',
                avatar: avatarTemp,
            }
        },
    ]
}

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      margin: 10
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));


const PartyList = (props) => {

    const [partyList, setPartyList] = useState([])

    useEffect(() => {
        setPartyList(createTempPartyList())
    }, []) 


    const altAvatar = (user) => {
        if(user.avatar){
            return <img style={{height: 40, width:40}} src={user.avatar} alt='avatar'/>
        }
        return user.name
    }

    const classes = useStyles();
    const instanceItems = props.instanceItems


    const userAuth = 2; //TODO: taken from auth.uid (redux)
    //const partyList from props.partyList from socket.io methods

    const party = partyList.filter((user) => {
        return user.user._id !== userAuth
    })

    return (
        <div className={classes.root}>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                className={classes.wrapper}
                spacing={2}
            > 
            {party.map((user) => {
                return(
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        className={classes.wrapper}
                        spacing={2}
                    > 
                    {user.inRoom ? (
                        <React.Fragment>
                            <Grid item xs={3}>
                            <Paper className={classes.paper}>{altAvatar(user.user)}</Paper>
                            </Grid>
                            <Grid item xs={9}>
                            <Paper className={classes.paper}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    className={classes.wrapper}
                                    spacing={1}
                                >
                                {instanceItems.map((item) => {
                                    
                                    return(
                                        <React.Fragment>
                                            {item.owner === user.user._id ? (
                                                <Paper className={classes.paper}><img style={{height: 40, width:40}} src={require(`../../../../assets/icons/items/${item.model.imgSrc}`)} alt='icon'/></Paper>
                                            ) : (
                                                null
                                            )}
                                        </React.Fragment>
                                    )
                                    
                                        
                                        /*<img style={{height: 40, width:40}} src={require(`../../../../assets/icons/items/${item.model.imgSrc}`)} alt='icon'/>*/
                                    
                                })}
                                </Grid>
                            </Paper>
                            </Grid>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Grid item xs={3}>
                            <Paper className={classes.paper}>...</Paper>
                            </Grid>
                            <Grid item xs={9}>
                            <Paper className={classes.paper}>...</Paper>
                            </Grid>
                        </React.Fragment>
                    )}   
                    </Grid>
                )
            })}
            </Grid>
                
            
        </div>
    )
}

export default PartyList
