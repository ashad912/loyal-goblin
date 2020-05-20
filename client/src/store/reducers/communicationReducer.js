const emptyWarning = {
    text: null,
    type: null
}


const initState = {
    warning: {...emptyWarning},
};


const communicationReducer = (state = initState, action) => {
    switch (action.type){ 
        case 'SET_WARNING':
            return {
                ...state,
                warning: action.warning,  
            }
        case 'RESET_WARNING':
            return {
                ...state,
                warning: {...emptyWarning},
            }
        default:
            return state;
    }
}


export default communicationReducer