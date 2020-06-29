const emptyWarning = {
    text: null,
    actionType: null
}


const initState = {
    warning: {...emptyWarning},
};


const communicationReducer = (state = initState, action) => {
    switch (action.type){ 
        case 'SET_CHECK_WARNING':
            return {
                ...state,
                warning: action.warning,  
            }
        case 'RESET_CHECK_WARNING':
            return {
                ...state,
                warning: {...emptyWarning},
            }
        default:
            return state;
    }
}


export default communicationReducer