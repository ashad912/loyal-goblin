const initState = null

const rallyReducer = (state = initState, action) => {
    switch(action.type){
        case 'UPDATE_RALLY': 
            return action.rally
        default:
            return state
            
    }
}

export default rallyReducer