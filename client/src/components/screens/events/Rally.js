import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from "@material-ui/core/Button";
import { Typography } from '@material-ui/core';
import styled from 'styled-components'
import moment from 'moment'

const StyledCard = styled(Card)`
    min-width: 275px;
    margin: 0 0 1rem 0;
`


const Bullet = styled.span`
    display: inline-block;
    margin: 0 2px 0 0;
    transform: scale(0.8);
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

    state = {}

    componentWillUnmount(){
        if(this.state.seconds !== 0){
            clearInterval(this.timer);
        }
    }

    componentDidMount = () => {
        this.timer = setInterval(this.countDown, 1000);
        const fullTime = this.props.rally.date.diff(moment(), 'seconds')
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
        console.log(this.props.rally.date.diff(moment(), 'seconds'))
    }


    // startAnimation = () => {
    //     this.timer = setInterval(this.countDown, 1000);
    //     this.setState({
    //         seconds: 5,
    //     });
    // }

   

    // endAnimation = () => {
    //     const svgRawObject = this.refs.boardsvg
    //     const doc = svgRawObject.contentDocument
    //     const field = doc.getElementsByName(this.state.loadedTorpedo.itemModel.name)[0] //assuming id as in serverFields array
    //     field.style.fill = 'red'
    //     this.handleTorpedoDelete(this.state.loadedTorpedo._id)
    // }


    render() { 
        
        const rally = this.props.rally
        return ( 
            <React.Fragment>
                {rally ? (
                    <React.Fragment>
                    {this.state.hasOwnProperty('fullTimeInSeconds') && this.state.fullTimeInSeconds > 0 ? (
                    <StyledCard>
                        <CardContent>
                            <Typography style={{fontSize: 14}} color="textSecondary" gutterBottom>
                                Ladies and Gentelmen!
                            </Typography>
                            <Typography variant="h5" component="h2">
                                oo
                            <Bullet>•</Bullet>
                                {rally.title}
                            <Bullet>•</Bullet>
                                oo
                            </Typography>
                            <Typography style={{marginBottom: '0.5rem'}} color="textSecondary">
                                
                                    {this.state.hasOwnProperty('days') && this.state.days > 0 && `${this.state.days} d. `}
                                    {this.state.hasOwnProperty('hours') && this.state.hours > 0 && `${this.state.hours} g. `}
                                    {this.state.hasOwnProperty('minutes') && this.state.minutes > 0 && `${this.state.minutes} min `}
                                    {this.state.hasOwnProperty('seconds') && this.state.seconds > 0 && `${this.state.seconds} s`}
       
                            </Typography>
                            <Typography variant="body2" component="p">
                                {rally.description}
                            <br />
                            {'"Treasurrrre!"'}
                            </Typography>
                        </CardContent>
                        <CardActions style={{justifyContent: 'flex-end'}}>
                            <Button onClick={this.handleRallyClick} size="small">Go in!</Button>
                        </CardActions>
                    </StyledCard>
                    ) : (
                        <RallyPlaceholder>Trwa wielki rajd!</RallyPlaceholder>
                    )}
                    </React.Fragment>
                ) : (<RallyPlaceholder>Rajd nie został zapowiedziany!</RallyPlaceholder>)}
            </React.Fragment>
        );
    }
}
 
export default Rally;

