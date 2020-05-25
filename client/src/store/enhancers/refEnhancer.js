const refStore = {
    resolveWarning: null,
};


export const refHandler = ({ getState }) => {
  return next => action => {
    switch(action.type){ // this can be done more elegantly with a redux-observable
      case 'SET_CHECK_WARNING':
        refStore.resolveWarning = action.warningRef // (3)
        break;
      case 'RESET_CHECK_WARNING':
        refStore.resolveWarning = null // (3)
        break;
    }
    return next(action)
  }
} 

export default refStore