export const setNavbarHeight = (navbarHeight) => {
    return (dispatch) => {
        dispatch({type: 'SET_NAVBAR_HEIGHT', navbarHeight})
    }
}

export const setFooterHeight = (footerHeight) => {
    return (dispatch) => {
        dispatch({type: 'SET_FOOTER_HEIGHT', footerHeight})
    }
}

export const setAppBarHeight = (appBarHeight) => {
    return (dispatch) => {
        dispatch({type: 'SET_APP_BAR_HEIGHT', appBarHeight})
    }
}