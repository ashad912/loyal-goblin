import axios from 'axios'

export const getShop = () => {
    return async dispatch => {
        try {
            const res = await axios.get('/product/shop')

            dispatch({type: 'GET_SHOP', shop:res.data.shop})
            dispatch({type: 'UPDATE_ACTIVE_ORDER', activeOrder: res.data.activeOrder})
            dispatch({type: "UPDATE_PARTY", party: res.data.party})

        } catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

export const activateOrder = (order) => {
    return async dispatch => {
        try {
            const arrayOrder = Object.keys(order).map(user => {
                order[user].forEach(product => {
                    product.product = product._id
                    delete product._id
                });
                
                console.log(order[user])
                return {profile: user, products: order[user]}
            })
            const res = await axios.patch('/product/activate', {order: arrayOrder})
            dispatch({type: 'UPDATE_ACTIVE_ORDER', activeOrder: res.data })

        } catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

