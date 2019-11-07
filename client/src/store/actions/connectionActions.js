export const resetConnectionError = () => {
    return dispatch => {
        return new Promise( async (resolve, reject) => {
       
                dispatch ( {type: "RESET_CONNECTION_ERROR"})
                resolve()

        })
    }
}