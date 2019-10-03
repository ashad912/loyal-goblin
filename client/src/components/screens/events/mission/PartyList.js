import React, {useEffect, useState} from 'react'

import Grid from '@material-ui/core/Grid';

import avatarTemp from '../../../../assets/avatar/moose.png'
import Typography from "@material-ui/core/Typography";
import styled from 'styled-components'
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';

const StyledContainer = styled(Grid)`
    min-height: 30px;
    margin-top: 0.5rem; 
    margin-bottom: 0.5rem;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    width: 100%;
    border: 1px solid #ddd;
    flex-grow: 1;
    flex-direction: 1;
`

const StyledImage = styled.img`
    height: 30px;
    width: 30px;
    margin: 0 0.2rem 0 0;
`

const RootDiv = styled.div`
    flex-grow: 1;
    margin-left: 2rem;
    margin-right: 2rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
`

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
            inRoom: false,
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



const PartyList = (props) => {

    const [partyList, setPartyList] = useState([])

    useEffect(() => {
        setPartyList(createTempPartyList())
    }, []) 


    const altAvatar = (user) => {
        if(user.avatar){
            return <img style={{height: 30, width:30}} src={user.avatar} alt='avatar'/>
        }
        return user.name
    }

    
    const instanceItems = props.instanceItems


    const userAuth = props.userId; //TODO: taken from auth.uid (redux)
    //const partyList from props.partyList from socket.io methods

    //show only rest of the party
    const party = partyList.filter((user) => {
        return user.user._id !== userAuth
    })

    return (
        <RootDiv>
            <Typography variant="h5">Drużyna:</Typography>
            <Grid
                
                container
                direction="column"
                justify="center"
                alignItems="center"
                
                spacing={2}
            > 
            {party.map((user) => {
                return(
                    <StyledContainer>
                    
                    <Grid
                        key={user.user._id}
                        container
                        direction="row"
                        spacing={2}
                        
                    > 
                    
                    {user.inRoom ? (
                        <React.Fragment>
                            <Grid item xs={3}>
                                {altAvatar(user.user)}
                            </Grid>
                            <Grid item xs={9}>
                                
                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="flex-start"
                                        spacing={1}
                                    >
                                    {instanceItems.map((item) => {
                                        
                                        return(
                                            <React.Fragment key={item._id}>
                                                {item.owner === user.user._id ? (
                                                    <StyledImage  src={require(`../../../../assets/icons/items/${item.model.imgSrc}`)} alt='icon'/>
                                                ) : (
                                                    null
                                                )}
                                            </React.Fragment>
                                        )
                                        
                                            
                                            /*<img style={{height: 40, width:40}} src={require(`../../../../assets/icons/items/${item.model.imgSrc}`)} alt='icon'/>*/
                                        
                                    })}
                                    </Grid>
                                
                            </Grid>
                            
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Grid item xs={3}>...</Grid>
                            <Grid item xs={9}></Grid>
                        </React.Fragment>
                    )}   
                    
                    
                    </Grid>
                    </StyledContainer>
                )
            })}
            </Grid>
                
            
        </RootDiv>
    )
}

export default PartyList
