import React, { Component } from 'react';
import boardsvg from '../../assets/statki.svg'

class ShipBoard extends Component {
    
    //open console
    //have to add 'id' props in .svg for each key object

    handleLoad = () => {
        
        //shot to backend - returned: field array
        let serverFields = [
            {id: 0, pressed: true},
            {id: 1, pressed: false},
            {id: 2, pressed: true},
            {id: 3, pressed: true},
            {id: 4, pressed: false},
            {id: 5, pressed: true},
            {id: 6, pressed: true},
            {id: 7, pressed: false},
            {id: 8, pressed: true},
            {id: 9, pressed: true},
            {id: 10, pressed: false},
            {id: 11, pressed: true},
            {id: 12, pressed: true},
            {id: 13, pressed: false},
            {id: 14, pressed: true},
            {id: 15, pressed: false},
            {id: 16, pressed: false},
            {id: 17, pressed: false},
            {id: 18, pressed: false},
            {id: 19, pressed: false},
        ]
        //
        console.log(serverFields)

        const svgRawObject = this.refs.boardsvg
        const doc = svgRawObject.contentDocument

        let fields = []

        for(let i=0; i < serverFields.length; i++){
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
    }

    handleClick = (e) => {
        const field = e.target
        console.log(field)

        const pressed_value = field.dataset.pressed === 'true' ? true : false
        if(pressed_value === false){
            //shot to backend: verify false value, next generate QR
            //verification failed: this.handleLoad() to reload styles -> protecting 'data-pressed' value manipulation
            
            field.style.fill = 'red'
        }
    }

    render() { 
        return ( 
            <object data={boardsvg} onLoad={this.handleLoad} type="image/svg+xml"
            id="boardsvg" ref='boardsvg' width="100%" height="100%"></object>       
        );
    }
}
 
export default ShipBoard;