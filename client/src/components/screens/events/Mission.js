import React from 'react'
import ExchangeArea from './mission/ExchangeArea'
import PartyList from './mission/PartyList'
import Loading from '../../layout/Loading';

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
const randomUserId = getRandomInt(1, 5)

export default class Mission extends React.Component {
    

    state = {
        instanceItems: [],
        loading: true,
        roomConnected: false
    }
        

    componentDidMount() {
        if(!this.props.location.state.id){
            this.backToEvents(this.props.history)
        }

        //api backend -> in response id missionInstance
        this.setState({
            loading: false
        })
    }
    
    
    backToEvents = (history) => {
        history.push({
          pathname: '/',
          state: {indexRedirect: 1}
        }) 
    }

    handleBack = () => {
        this.backToEvents(this.props.history)
    }

    handleConnection = () => {
        this.setState({
            roomConnected: true
        })
    }

    updateInstanceItems = (items) => {
        this.setState({
            instanceItems: items
        })
    }
   
    render(){
        if(this.state.loading){
            return <Loading />
        }
        return(
            <React.Fragment>
                <div onClick={this.handleBack}>
                    <p>Back</p> 
                </div>
                <ExchangeArea userId={randomUserId} locationId={this.props.location.state.id} setConnection={this.handleConnection} instanceItems={this.updateInstanceItems}/>
                {this.state.roomConnected ? (
                    
                    <PartyList userId={randomUserId} instanceItems={this.state.instanceItems}/>
                    ) : (
                    null
                )}
                
            </React.Fragment>
        )
    }
  
    
    
}
