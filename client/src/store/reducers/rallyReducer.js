const initState = {
    rally: null
}

const rallyReducer = (state = initState, action) => {
    switch(action.type){
        case 'UPDATE_RALLY': 
            return{
                rally: action.rally
            }
        default:
            return state
            
    }
}

export default rallyReducer