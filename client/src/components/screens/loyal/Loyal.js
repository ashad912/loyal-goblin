import React, { Component } from 'react';
import Parser from 'html-react-parser'
import boardsvg from 'assets/board/statki-goblin.svg'
import Loading from 'components/layout/Loading';
import TorpedoDrawer from './TorpedoDrawer'
import LoadedTorpedo from './LoadedTorpedo'
import LoyalAwardDialog from './LoyalAwardDialog'
import Button from "@material-ui/core/Button";
import { Typography } from '@material-ui/core';
import styled, {css, keyframes, createGlobalStyle} from 'styled-components'
import { connect } from 'react-redux';
import {shootShip} from 'store/actions/profileActions'
import { palette } from 'utils/definitions';
import { PintoTypography } from 'utils/fonts';


const GlobalStyle = createGlobalStyle`
 
`

// const pulse = keyframes`
//     from{
//         opacity: 1;
//     }
//     to{
//         opacity:0;
//     }

// `

// const animation =
//     css`
//         ${pulse} 1s linear;
//     `

const LoadedTorpedoContainer = styled.div`
    align-items: center;
    justify-content: center;
    display: flex;
    margin: auto;
    min-height: 74px;
`
//ship1: B4L4 -> B4, B5, B6, B7
//ship2: I1L4 => I1, I2, I3, I4
//ship3: F9L5 -> F9, E9, D9, C9, B9
//ship4: D1L2 -> D1, C1
//ship5: E3L3 -> E3, E4, E5
//ship6: H7L2 -> H7, G7




class Loyal extends Component {

    constructor() {
        super();
        this.timer = 0;
        this.wrecksIds = ["117", "103", "116", "101", "102", "110"];
        this.wrecks = [["B4", "B5", "B6", "B7"], ["I1", "I2", "I3", "I4"], ["F9", "E9", "D9", "C9", "B9"], ["D1", "C1"], ["E3", "E4", "E5"], ["H7", "G7"]]
        
    }
    
    state = {
        seconds: 0,
        loading: true,
        dialogOpen: false,
        userTorpedos: [],
        loadedTorpedo: undefined,
        showTorpedosModal: false,
        award: false, 
    }



    manageWrecks = (doc) => {
        this.wrecks.forEach((wreck, index) => {
            
            const svgWreck = doc.getElementById(this.wrecksIds[index])

            const isWreck = this.isWreck(wreck)
            svgWreck.style.visibility = isWreck ? 'visible' : 'hidden'

            
            wreck.forEach((fieldName) => {
                const field = doc.getElementsByName(fieldName)[0]
                field.style.visibility = isWreck ? 'hidden' : 'visible'
            })
                
        })
    }

    isWreck = (wreck) => {
        const ship =  this.state.serverFields.filter((field) => {
            return wreck.includes(field.name) && field.pressed === true
        })
        return ship.length === wreck.length
    }

    componentWillUnmount(){
        if(this.state.seconds !== 0){
            clearInterval(this.timer);
        }
    }

    componentDidMount = () => {

        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        


        this.setState({
            iOS,
            userTorpedos: this.props.bag.filter((item) => item.itemModel.type === "torpedo"),
            serverFields: [
                {id: 1, name: 'D1', pressed: this.props.loyal['D1']},
                {id: 2, name: 'E3', pressed: this.props.loyal['E3']},
                {id: 3, name: 'I1', pressed: this.props.loyal['I1']},
                {id: 4, name: 'I2', pressed: this.props.loyal['I2']},
                {id: 5, name: 'I3', pressed: this.props.loyal['I3']},
                {id: 6, name: 'I4', pressed: this.props.loyal['I4']},
                {id: 7, name: 'E4', pressed: this.props.loyal['E4']},
                {id: 8, name: 'E5', pressed: this.props.loyal['E5']},
                {id: 9, name: 'G7', pressed: this.props.loyal['G7']},
                {id: 10, name: 'H7', pressed: this.props.loyal['H7']},
                {id: 11, name: 'C1', pressed: this.props.loyal['C1']},
                {id: 12, name: 'B9', pressed: this.props.loyal['B9']},
                {id: 13, name: 'C9', pressed: this.props.loyal['C9']},
                {id: 14, name: 'D9', pressed: this.props.loyal['D9']},
                {id: 15, name: 'E9', pressed: this.props.loyal['E9']},
                {id: 16, name: 'F9', pressed: this.props.loyal['F9']},
                {id: 17, name: 'B4', pressed: this.props.loyal['B4']},
                {id: 18, name: 'B5', pressed: this.props.loyal['B5']},
                {id: 19, name: 'B6', pressed: this.props.loyal['B6']},
                {id: 20, name: 'B7', pressed: this.props.loyal['B7']},
            ]
            // serverFields: [
            //         {id: 1, name: 'D1', pressed: true},
            //         {id: 2, name: 'E3', pressed: false},
            //         {id: 3, name: 'I1', pressed: true},
            //         {id: 4, name: 'I2', pressed: true},
            //         {id: 5, name: 'I3', pressed: false},
            //         {id: 6, name: 'I4', pressed: true},
            //         {id: 7, name: 'E4', pressed: true},
            //         {id: 8, name: 'E5', pressed: false},
            //         {id: 9, name: 'G7', pressed: true},
            //         {id: 10, name: 'H7', pressed: true},
            //         {id: 11, name: 'C1', pressed: true},
            //         {id: 12, name: 'B9', pressed: true},
            //         {id: 13, name: 'C9', pressed: true},
            //         {id: 14, name: 'D9', pressed: false},
            //         {id: 15, name: 'E9', pressed: true},
            //         {id: 16, name: 'F9', pressed: false},
            //         {id: 17, name: 'B4', pressed: true},
            //         {id: 18, name: 'B5', pressed: true},
            //         {id: 19, name: 'B6', pressed: true},
            //         {id: 20, name: 'B7', pressed: false},
            //     ]
        })
    }



    handleLoad = () => {
        
        const serverFields = this.state.serverFields

        //EXERCISES: setting css rule by js (does not work for svg inside elements)
        // const css = '.object:hover {background-color: green;}'
        // var style = document.createElement('style');

        // if (style.styleSheet) {
        //     style.styleSheet.cssText = css;
        // } else {
        //     style.appendChild(document.createTextNode(css));
        // }

        // document.getElementsByTagName('head')[0].appendChild(style);
        //


        const svgRawObject = this.refs.boardsvg
        const doc = svgRawObject.contentDocument

        let fields = []

        for(let i=1; i < serverFields.length +1; i++){
            const field = doc.getElementById(`${i}`) //assuming id as in serverFields array
           
            const fieldServerData = serverFields.find(field => {
                return field.id === i
            })
            field.style.pointerEvents = 'bounding-box'
            if(fieldServerData.pressed){
                //style manipulation here
                field.style.fill = 'red'
            }
            // field.animate([
            //     {opacity: 1},
            //     {opacity: 0}
            // ], {
            //     duration: 10000,
            //     iterations: Infinity
            // })

            


            field.setAttribute('data-pressed', fieldServerData.pressed) //element attribute
            //field.addEventListener('click', this.handleClick) //setting listener - does not work for g group
            //console.log(field.style)

            //EXERCISES: hover effect
            // field.addEventListener('mouseenter', () => {
            //     field.style.fill = 'green'
            // })
            // field.addEventListener('mouseleave', () => {
            //     field.style.fill = fieldServerData.pressed ? 'red' : 'black'
            // })

            fields = [...fields, field]
        }

        
        this.manageWrecks(doc)

        this.setState({
            loading: false
        })
    }

    handleClick = (e) => {

    //EXERCISES: SAVING PATH HTML TO STRING
    // console.log(e.target)
    // this.setState({
    //     copy: e.target.outerHTML
    // },() => {
    //     setTimeout(() => {
    //         this.setState({
    //             copy: null
    //         })
    //     }, 1000)
    // })


    //LEGACY: CLICK HANDLER
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
    }

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
    
    };

    handleTorpedoToggle = (id) => {
        const torpedo = this.state.userTorpedos.find((torpedo) => {
            return torpedo._id === id
        })
        this.setState({
            loadedTorpedo: torpedo
        })
    }

    handleShoot =  () => {
        if(this.state.seconds === 0){
            const svgRawObject = this.refs.boardsvg
            const doc = svgRawObject.contentDocument
            const field = doc.getElementsByName(this.state.loadedTorpedo.itemModel.name)[0] //assuming id as in serverFields array
    
    
            const pressed_value = field.dataset.pressed === 'true' ? true : false
            if(pressed_value === false){
                var animation;
                if(!this.state.iOS){
                    animation = field.animate([
                        {fill: 'black'},
                        {fill: 'red'}
                    ], {
                        duration: 500,
                        direction: 'alternate',
                        easing: 'ease-in-out',
                        iterations: Infinity
                    })
                }else{
                    field.style.fill = 'orange' 
                }
                
                
                
                this.startAnimation(animation)
       
            }
        }
        

    }
    startAnimation = (animation) => {
        this.timer = setInterval(this.countDown, 1000);
        this.setState({
            seconds: 5,
            animation
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

    endAnimation = async () => {
        const svgRawObject = this.refs.boardsvg
        const doc = svgRawObject.contentDocument
        
        const field = doc.getElementsByName(this.state.loadedTorpedo.itemModel.name)[0] //assuming id as in serverFields array        
        const animation = this.state.animation

        if(!this.state.iOS){
            animation.cancel()
        }

        try{
            
            const award = await this.props.shootShip(this.state.loadedTorpedo.itemModel.name)

            

            if(award){
               

                for(let i=1; i < this.state.serverFields.length + 1; i++){
                    const field = doc.getElementById(`${i}`) //assuming id as in serverFields array
                    field.style.fill = 'black'
                }
                const modifiedServerFields = [...this.state.serverFields]
                
                modifiedServerFields.forEach((stateField) => stateField.pressed = false)
                
                this.setState({
                    award: award,
                    serverFields: modifiedServerFields,
                }, () => {
                    this.manageWrecks(doc)
                    
                })

            }else{

                
                field.style.fill = 'red'
                
                const modifiedServerFields = [...this.state.serverFields]

                modifiedServerFields.forEach((stateField) => {
                    if(stateField.name === this.state.loadedTorpedo.itemModel.name){
                        stateField.pressed = true
                    }
                })

                this.setState({
                    serverFields: modifiedServerFields
                }, () => {
                    this.manageWrecks(doc)
                   
                })
                
            }
            
            this.handleTorpedoDelete(this.state.loadedTorpedo._id)
                 
        }catch(e){
            console.log(e)
        }
        
        
    }

    handleToggleTorpedosModal = e => {
        this.setState(prevState => {
          return { 
            showTorpedosModal: !prevState.showTorpedosModal,
            userTorpedos: prevState.showTorpedosModal === false ? this.props.bag.filter((item) => item.itemModel.type === "torpedo") : this.state.userTorpedos
           };
        });
        
    };

    render() { 
        const userTorpedos = this.state.userTorpedos

        //EXERCISES: excluding part of svg
        // to use: {copy}
        // const copy = this.state.copy ? (
        //     <svg version="1.1"  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 915.8 929.2">
        //         {Parser(this.state.copy)} 
        //     </svg>
        // ) : null
        
        
        return ( 
            <React.Fragment>
            
            <div style={{display: 'flex', flexDirection: 'column', minHeight: this.props.fullHeight}}>
            <GlobalStyle/>
                {this.state.loading && <Loading/>}
                <LoadedTorpedoContainer>
                    {this.state.loadedTorpedo ? (
                        <LoadedTorpedo torpedo={this.state.loadedTorpedo} handleShoot={this.handleShoot} inProgress={this.state.seconds > 0} fields={this.state.serverFields}/>
                    ): (
                        <Typography variant='h5' >Wybierz i załaduj torpedę!</Typography>
                    )}
                </LoadedTorpedoContainer>
                <object 
                    data={boardsvg} 
                    onLoad={this.handleLoad} 
                    type="image/svg+xml"
                    id="boardsvg" ref='boardsvg' 
                    style={{pointerEvents: 'bounding-box', width: '90%', margin: 'auto'}}
                >
                    Board
                </object> 
                
                
                <Button
                    disabled={this.state.seconds !== 0}     
                    variant="contained" 
                    color="primary" 
                    onClick={this.handleToggleTorpedosModal} 
                    style={{
                        margin: 'auto',
                        padding: '1rem 0.5rem',
                        borderRadius: '10px'
                    }}>
                    Moje torpedy
                </Button>
                <PintoTypography 
                    style={{
                        color: palette.background.darkGrey,
                        fontSize: `2vh`,
                        margin: 'auto',
                        width: '65%'
                    }}
                >
                    Pij browary w Goblinie by zdobywać torpedy i zbijać statki! 
                    <br/>
                    Za zbicie całej floty otrzymasz nagrodę!
                </PintoTypography>
                <TorpedoDrawer
                    handleOpen={this.state.showTorpedosModal}
                    handleClose={this.handleToggleTorpedosModal}
                    userTorpedos={userTorpedos}
                    loadedTorpedoId={this.state.loadedTorpedo ? this.state.loadedTorpedo._id : undefined}
                    handleTorpedoToggle={this.handleTorpedoToggle}
                    handleTorpedoDelete={this.handleTorpedoDelete}
                />
                    
            {this.state.award && 
                <LoyalAwardDialog
                    open={this.state.award}
                    handleClose={() => {this.setState({award: null})}}
                    award={this.state.award}
                /> 
            }    
              
            </div>
            </React.Fragment>      
        );
    }
}

const mapStateToProps = (state) => {
    return {
        bag: state.auth.profile.bag,
        loyal: state.auth.profile.loyal
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        shootShip: (fieldName) => dispatch(shootShip(fieldName))
    }
  }
 
export default connect(mapStateToProps, mapDispatchToProps)(Loyal);