import React, { Component } from 'react';
import boardsvg from '../../assets/board/statki.svg'
import Loading from '../layout/Loading';
import VerificationDialog from './loyal/VerificationDialog'
import TorpedoList from './loyal/TorpedoList'
import LoadedTorpedo from './loyal/LoadedTorpedo'
import Button from "@material-ui/core/Button";
import { Typography } from '@material-ui/core';
import styled from 'styled-components'


const LoadedTorpedoContainer = styled.div`
    align-items: center;
    justify-content: center;
    display: flex;
    margin-bottom: 1rem;
    min-height: 74px;
`

const createTempTorpedos = () => {

    return [
        {
            _id: 120,
            owner: 11111,
            itemModel: {
              _id: 600,
              type: {
                _id: 6,
                type: "torpedo"
              },
              name: "D1",
              fluff: "Ostrzelaj pole D1!",
              imgSrc: "torpedo.png"
            }
        },
        {
            _id: 121,
            owner: 11111,
            itemModel: {
              _id: 601,
              type: {
                _id: 6,
                type: "torpedo"
              },
              name: "E3",
              fluff: "Ostrzelaj pole E3!",
              imgSrc: "torpedo.png"
            }
        },
        {
            _id: 23121,
            owner: 11111,
            itemModel: {
              _id: 601,
              type: {
                _id: 6,
                type: "torpedo"
              },
              name: "E3",
              fluff: "Ostrzelaj pole E3!",
              imgSrc: "torpedo.png"
            }
        },
        {
            _id: 23122,
            owner: 11111,
            itemModel: {
              _id: 601,
              type: {
                _id: 6,
                type: "torpedo"
              },
              name: "E3",
              fluff: "Ostrzelaj pole E3!",
              imgSrc: "torpedo.png"
            }
        },
        {
            _id: 122,
            owner: 11111,
            itemModel: {
              _id: 602,
              type: {
                _id: 6,
                type: "torpedo"
              },
              name: "I3",
              fluff: "Ostrzelaj pole I3!",
              imgSrc: "torpedo.png"
            }
        },
    ]
}


class Loyal extends Component {

    constructor() {
        super();
        this.timer = 0;
    }
    
    state = {
        seconds: 0,
        loading: true,
        dialogOpen: false,
        userTorpedos: createTempTorpedos(),
        loadedTorpedo: undefined,
        showTorpedosModal: false
    }
    //open console
    //have to add 'id' props in .svg for each key object

    componentWillUnmount(){
        if(this.state.seconds !== 0){
            clearInterval(this.timer);
        }
    }

    handleLoad = () => {
        
        //shot to backend - returned: field array
        let serverFields = [
            {id: 1, name: 'D1', pressed: true},
            {id: 2, name: 'E3', pressed: false},
            {id: 3, name: 'I1', pressed: true},
            {id: 4, name: 'I2', pressed: true},
            {id: 5, name: 'I3', pressed: false},
            {id: 6, name: 'I4', pressed: true},
            {id: 7, name: 'E4', pressed: true},
            {id: 8, name: 'E5', pressed: false},
            {id: 9, name: 'G7', pressed: true},
            {id: 10, name: 'H7', pressed: true},
            {id: 11, name: 'C1', pressed: false},
            {id: 12, name: 'B9', pressed: true},
            {id: 13, name: 'C9', pressed: true},
            {id: 14, name: 'D9', pressed: false},
            {id: 15, name: 'E9', pressed: true},
            {id: 16, name: 'F9', pressed: false},
            {id: 17, name: 'B4', pressed: false},
            {id: 18, name: 'B5', pressed: false},
            {id: 19, name: 'B6', pressed: false},
            {id: 20, name: 'B7', pressed: false},
        ]
        //

        console.log(serverFields)

        const svgRawObject = this.refs.boardsvg
        const doc = svgRawObject.contentDocument

        let fields = []

        for(let i=1; i < serverFields.length +1; i++){
            const field = doc.getElementById(`${i}`) //assuming id as in serverFields array
            console.log(field)
            const fieldServerData = serverFields.find(field => {
                return field.id === i
            })
            if(fieldServerData.pressed){
                //style manipulation here
                field.style.fill = 'red'
            }
            field.setAttribute('data-pressed', fieldServerData.pressed) //element attribute
            field.addEventListener('click', this.handleClick) //setting listener
            fields = [...fields, field]
        }
        console.log(fields)

        this.setState({
            loading: false
        })
    }

    // handleClick = (e) => {
    //     const field = e.target
    //     console.log(field)

    //     const pressed_value = field.dataset.pressed === 'true' ? true : false
    //     if(pressed_value === false){
    //         //shot to backend: verify false value, next generate QR
    //         //socket for auto-effect when qr scan is confirmed
    //         //verification failed: this.handleLoad() to reload styles -> protecting 'data-pressed' value manipulation
    //         this.setState({
    //             dialogOpen: true
    //         })

    //         field.style.fill = 'red'
    //     }
    // }

    handleDialogClose = () => {
        this.setState({
            dialogOpen: false
        })
    }

    handleTorpedoDelete = (id) => {
        const torpedos = this.state.userTorpedos.filter((torpedo) => {
            return torpedo._id !== id
        })


        let loadedTorpedo = this.state.loadedTorpedo
        if(loadedTorpedo && loadedTorpedo._id === id){
            loadedTorpedo = undefined
        }
        
        this.setState({
            userTorpedos: torpedos,
            loadedTorpedo: loadedTorpedo
        })
    
    
        //TODO: Call to backend
      };

    handleTorpedoToggle = (id) => {
        const torpedo = this.state.userTorpedos.find((torpedo) => {
            return torpedo._id === id
        })
        this.setState({
            loadedTorpedo: torpedo
        })
    }

    handleShoot = () => {
        if(this.state.seconds === 0){
            const svgRawObject = this.refs.boardsvg
            const doc = svgRawObject.contentDocument
            const field = doc.getElementsByName(this.state.loadedTorpedo.itemModel.name)[0] //assuming id as in serverFields array
    
    
            const pressed_value = field.dataset.pressed === 'true' ? true : false
            if(pressed_value === false){
                //shot to backend: verify false value, next generate QR
                //socket for auto-effect when qr scan is confirmed
                //verification failed: this.handleLoad() to reload styles -> protecting 'data-pressed' value manipulation
    
                field.style.fill = 'orange'
                this.startAnimation()
       
            }
        }
        

    }
    startAnimation = () => {
        this.timer = setInterval(this.countDown, 1000);
        this.setState({
            seconds: 5,
        });
    }

    countDown = () => {
        let seconds = this.state.seconds - 1;
        this.setState({
          seconds: seconds,
        });
    
        if (seconds == 0) { 
          clearInterval(this.timer);
          this.endAnimation()
        }
    
    }

    endAnimation = () => {
        const svgRawObject = this.refs.boardsvg
        const doc = svgRawObject.contentDocument
        const field = doc.getElementsByName(this.state.loadedTorpedo.itemModel.name)[0] //assuming id as in serverFields array
        field.style.fill = 'red'
        this.handleTorpedoDelete(this.state.loadedTorpedo._id)
    }

    handleToggleTorpedosModal = e => {
        this.setState(prevState => {
          return { 
            showTorpedosModal: !prevState.showTorpedosModal,
           };
        });
        
      };

    render() { 
        const userTorpedos = this.state.userTorpedos
        console.log(this.state.seconds)
        return ( 
            <React.Fragment>
                {this.state.loading && <Loading/>}
                <LoadedTorpedoContainer>
                    {this.state.loadedTorpedo ? (
                        <LoadedTorpedo torpedo={this.state.loadedTorpedo} handleShoot={this.handleShoot} inProgress={this.state.seconds > 0}/>
                    ): (
                        <Typography variant='h5' >Wybierz i załaduj torpedę!</Typography>
                    )}
                </LoadedTorpedoContainer>
                <object data={boardsvg} onLoad={this.handleLoad} type="image/svg+xml"
                id="boardsvg" ref='boardsvg' width="100%" height="100%">Board</object> 
                
                {this.state.seconds === 0 && (
                    <React.Fragment>
                        <Button variant="outlined" color="primary" onClick={this.handleToggleTorpedosModal} style={{marginTop: '1.1rem'}}>
                            Moje torpedy
                        </Button>
                        <TorpedoList 
                            handleOpen={this.state.showTorpedosModal}
                            handleClose={this.handleToggleTorpedosModal}
                            userTorpedos={userTorpedos}
                            loadedTorpedoId={this.state.loadedTorpedo ? this.state.loadedTorpedo._id : undefined}
                            handleTorpedoToggle={this.handleTorpedoToggle}
                            handleTorpedoDelete={this.handleTorpedoDelete}
                        />
                    </React.Fragment>)}
                <VerificationDialog
                    open={this.state.dialogOpen}
                    handleClose={this.handleDialogClose}
                />
            </React.Fragment>      
        );
    }
}
 
export default Loyal;