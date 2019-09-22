import React from 'react'
import ExchangeArea from './mission/ExchangeArea'
import PartyList from './mission/PartyList'
import Loading from '../../layout/Loading';
import { throws } from 'assert';

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
                <ExchangeArea locationId={this.props.location.state.id} setConnection={this.handleConnection} instanceItems={this.updateInstanceItems}/>
                {this.state.roomConnected ? (
                    <PartyList instanceItems={this.state.instanceItems}/>
                    ) : (
                    null
                )}
                
            </React.Fragment>
        )
    }
  
    
    
}
