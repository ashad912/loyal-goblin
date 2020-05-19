const emptyWarning = {
    action: null,
    text: null,
    type: null
}


const initState = {
    warning: {...emptyWarning}
};


const communicationReducer = (state = initState, action) => {
    switch (action.type){ //it ll generate thing to authReducer not firebaseReducer remember!
        case 'SET_WARNING':
            return {
                ...state,
                warning: action.warning,
                
        }
        case 'RESET_WARNING':
            //console.log("reset connection error")
            return {
                ...state,
                warning: {...emptyWarning},
        }
        default:
            return state;
    }
}


export default communicationReducer