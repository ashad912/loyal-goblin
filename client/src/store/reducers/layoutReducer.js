const initState = {
    navbarHeight: 0,
    footerHeight: 0,
    appBarHeight: 0
}

export default (state = initState, action) => {
    switch(action.type){
        case 'SET_NAVBAR_HEIGHT':
            return{
                ...state, 
                navbarHeight: action.navbarHeight
            }
        case 'SET_FOOTER_HEIGHT':
            return {
                ...state,
                footerHeight: action.footerHeight
            }
        case 'SET_APP_BAR_HEIGHT':
            return {
                ...state,
                appBarHeight: action.appBarHeight
            }
        default: 
            return state
    }
}