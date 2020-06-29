export const setCheckWarning = (action, text, actionType) => {
    return {type: 'SET_CHECK_WARNING', warning: {text, actionType}, warningRef: action}
}

export const resetCheckWarning = () => {
    return {type: 'RESET_CHECK_WARNING'}
}