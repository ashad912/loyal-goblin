import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from "@material-ui/core/Button";
import { Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { Badge } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { ListItemText } from '@material-ui/core';
import { List } from '@material-ui/core';
import styled from 'styled-components'
import moment from 'moment'
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const StyledCard = styled(Card)`
    min-width: 275px;
    margin: 0 0 1rem 0;
  
`

const ActiveRallyTypo = styled(Typography)`
    color: ${props => props.active ? ('red') : ('#3f51b5')}
`

const RallyPlaceholder = styled.div`
    display: flex;
    height: 100%;
    width: auto;
    justify-content: center;
    align-items: center;
    margin: 0 0 1rem 0;
   
`

class Rally extends Component {

    constructor() {
        super();
        this.timer = 0;
    }

    state = {
        openAwards: ''
    }

    componentWillUnmount(){
        if(this.state.seconds !== 0){
            clearInterval(this.timer);
        }
    }

    componentDidMount = () => {
        this.timer = setInterval(this.countDown, 1000);
        const fullTime = this.props.rally.activationDate.diff(moment(), 'seconds')
        this.updateCounter(fullTime)
    }


    countDown = () => {
        const fullTime = this.state.fullTimeInSeconds - 1;
        this.updateCounter(fullTime)   
    }

    updateCounter = (fullTime) => {
        
        const days = parseInt(fullTime / 86400)
        const hours = parseInt((fullTime - 86400*days) / 3600)
        const minutes = parseInt((fullTime - 86400*days - 3600*hours) / 60)
        const seconds = parseInt(((fullTime - 86400*days - 3600*hours - 60*minutes)))
        this.setState({
            fullTimeInSeconds: fullTime,
            days,
            hours,
            minutes,
            seconds
        }, () => {
            if (fullTime == 0) { 
                clearInterval(this.timer);
                // this.endAnimation()
              }
        })
    }

    handleRallyClick = () => {
        console.log('clicked rally')
        console.log(this.props.rally.activationDate.diff(moment(), 'seconds'))
    }


    handleOpenAwards = event => {
        if (event.currentTarget.dataset.value === this.state.openAwards) {
          this.setState({
              openAwards: ''
          })
        } else {
          this.setState({
              openAwards: event.currentTarget.dataset.value
          })
        }
    };


    render() { 
        const height = 100
        const width = 100
        const rally = this.props.rally
        const rallyIsActive = this.props.rally.activationDate.diff(moment()) <= 0
        return ( 
            <React.Fragment>
                {rally ? (
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {rallyIsActive ? ('Trwa wielki rajd!') :('Nadchodzi wielki rajd!')}
                            </Typography>
                            <ActiveRallyTypo variant="h5" active={rallyIsActive}>
                                
                                    {this.state.hasOwnProperty('days') && this.state.days > 0 && `${this.state.days} d. `}
                                    {this.state.hasOwnProperty('hours') && this.state.hours > 0 && `${this.state.hours} g. `}
                                    {this.state.hasOwnProperty('minutes') && this.state.minutes > 0 && `${this.state.minutes} min `}
                                    {this.state.hasOwnProperty('seconds') && this.state.seconds > 0 && `${this.state.seconds} s`}
       
                            </ActiveRallyTypo>
                            <Badge
                                style={{height: height, width: width, marginRight: '0.5rem', marginTop: '0.6rem', marginBottom: '1rem'}}
                                overlap="circle"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                            >
                                <Avatar style={{height: height, width: width, }} alt="avatar" src={rally.avatarSrc} />
                            </Badge>
                            <Typography variant="h5" style={{marginBottom: '0.5rem'}}>
                            
                                {rally.title}
                            
                            </Typography>
                            
                            <Typography variant="body2" style={{fontSize: '12px'}} component="p">
                                {rally.description}
                            </Typography>
                        </CardContent>
                        <CardActions style={{justifyContent: 'flex-end'}}>
                            <Button onClick={this.props.handleRallyAwardsOpen} color="primary" size="small">Sprawdź nagrody</Button>
                        </CardActions>
                        
                    </StyledCard>
                    
                    
                ) : (<RallyPlaceholder><Typography variant="h5">Rajd nie został zapowiedziany!</Typography></RallyPlaceholder>)}
            </React.Fragment>
        );
    }
}
 
export default Rally;

