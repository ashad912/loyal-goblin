import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from "@material-ui/core/Button";
import { Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { Badge } from '@material-ui/core';
import styled from 'styled-components'
import moment from 'moment'
import { ralliesPath, palette } from '../../../utils/definitions';


const StyledCard = styled(Card)`
    min-width: 275px;
    margin: 0 0 1rem 0;
  
`

const ActiveRallyTypo = styled(Typography)`
    color: ${props => props.active ? (palette.secondary.main) : (palette.primary.main)};
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
        rallyExpired: false,
        loading: true,
    }

    componentWillUnmount(){
        if(this.state.fullTimeInSeconds !== 0){
            clearInterval(this.timer);
        }
        

        
    }

    initTimer = () => {
       
        if(this.state.startDate.diff(moment(), 'seconds') > 0){
            const fullTime = this.state.startDate.diff(moment(), 'seconds')
            this.updateCounter(fullTime)
            this.timer = setInterval(this.countDown, 1000);
        }else if(this.state.expiryDate.diff(moment(), 'seconds') > 0){
            const fullTime = this.state.expiryDate.diff(moment(), 'seconds')
            this.updateCounter(fullTime)
            this.timer = setInterval(this.countDown, 1000);
        }else{
            this.setState({
                rallyExpired: true
            }, () => {
                this.props.handleRallyDetailsClose()
                let timer = setTimeout(() => {
                    this.props.refreshProfile()
                }, 3000)
                return () => clearTimeout(timer);
            })
        }
       
    }

    componentDidMount = () => {
        
        if(this.props.rally){
            const startDate = moment(this.props.rally.startDate)
            const expiryDate = moment(this.props.rally.expiryDate)
            
            this.setState({
                startDate,
                expiryDate,
                loading: false
            }, () => {
                this.initTimer()
            })
         }else{
             this.setState({
                 loading: false
             })
         } 
        
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
            if (fullTime === 0) { 
                clearInterval(this.timer);
                this.initTimer()
            }
        })
    }

    render() { 
        if(this.state.loading){
            return null
        }
        const height = 100
        const width = 100
        const rally = this.props.rally
        const rallyIsActive = this.props.rally && this.state.startDate.diff(moment(), 's') <= 0
        return ( 
            <React.Fragment>
                {rally && !this.state.rallyExpired ? (
                    <StyledCard>
                        <CardContent style={{paddingBottom: '0.5rem'}}>
                            <Typography variant="body1" color="textSecondary" gutterBottom>
                                {rallyIsActive ? ('Trwa wielki rajd!') : ('Nadchodzi wielki rajd!')}
                            </Typography>
                            <ActiveRallyTypo variant="h5" active={rallyIsActive ? 1 : 0}>
                                
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
                                <Avatar style={{height: height, width: width, }} alt="avatar" src={`${ralliesPath}${rally.imgSrc}`} />
                            </Badge>
                            <Typography variant="h5">
                                {rally.title}
                            </Typography>
                                {rallyIsActive && <Typography >Zdobyte doświadczenie: {!rally.users.length ? '0' : rally.users[0].experience} PD</Typography>}
                        </CardContent>
                        <CardActions style={{justifyContent: 'flex-end'}}>
                            <Button onClick={this.props.handleRallyDetailsOpen} color="primary" fullWidth>Szczegóły i nagrody</Button>
                        </CardActions>
                        
                    </StyledCard>
                    
                    
                ) : (<RallyPlaceholder><Typography variant="h6">Rajd nie został zapowiedziany!</Typography></RallyPlaceholder>)}
            </React.Fragment>
        );
    }
}
 
export default Rally;

