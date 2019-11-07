export const resetConnectionError = () => {
    return dispatch => {
        return new Promise( async (resolve, reject) => {
       
                dispatch ( {type: "RESET_CONNECTION_ERROR"})
                resolve()

        })
    }
}


export const setLoading = (isLoading) => {
    return {type: "LOADING", loading: isLoading}
}