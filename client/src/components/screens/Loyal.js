import React, { Component } from 'react';
import boardsvg from '../../assets/board/statki.svg'
import Loading from '../layout/Loading';
import VerificationDialog from './loyal/VerificationDialog'
import TorpedoList from './loyal/TorpedoList'


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
    
    state = {
        loading: true,
        dialogOpen: false,
    }
    //open console
    //have to add 'id' props in .svg for each key object



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

    handleClick = (e) => {
        const field = e.target
        console.log(field)

        const pressed_value = field.dataset.pressed === 'true' ? true : false
        if(pressed_value === false){
            //shot to backend: verify false value, next generate QR
            //socket for auto-effect when qr scan is confirmed
            //verification failed: this.handleLoad() to reload styles -> protecting 'data-pressed' value manipulation
            this.setState({
                dialogOpen: true
            })

            field.style.fill = 'red'
        }
    }

    handleDialogClose = () => {
        this.setState({
            dialogOpen: false
        })
    }

    

    handleTorpedoToggle = () => {

    }

    render() { 
        const userTorpedos = createTempTorpedos()
        
        return ( 
            <React.Fragment>
                {this.state.loading && <Loading/>}
                
                <object data={boardsvg} onLoad={this.handleLoad} type="image/svg+xml"
                id="boardsvg" ref='boardsvg' width="100%" height="100%">Board</object> 
                <TorpedoList userTorpedos={userTorpedos} loadedTorpedoId={121} handleTorpedoToggle={this.handleTorpedoToggle}/>
                <VerificationDialog
                    open={this.state.dialogOpen}
                    handleClose={this.handleDialogClose}
                />
            </React.Fragment>      
        );
    }
}
 
export default Loyal;