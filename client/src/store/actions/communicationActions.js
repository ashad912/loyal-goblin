export const setWarning = (action, text, type) => {
    console.log(action)
    return {type: 'SET_WARNING', warning: {action, text, type}}
}

export const resetWarning = () => {
    return {type: 'RESET_WARNING'}
}