
import axios from 'axios'
import {partyRefreshEmit} from '../../socket'

export const getShop = () => {
    return async dispatch => {
        try {
            const res = await axios.get('/product/shop')

            dispatch({type: 'GET_SHOP', shop:res.data.shop})
            dispatch({type: 'UPDATE_ACTIVE_ORDER', activeOrder: res.data.activeOrder})
            dispatch({type: "UPDATE_PARTY", party: res.data.party})
            if(res.data.party){
                partyRefreshEmit(res.data.party._id)
            }

        } catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

export const leaveShop = () => {
    return async dispatch => {
        try {
            const res = await axios.patch('/product/leave')

            dispatch({type: 'LEAVE_SHOP'})
            if(res.data){
                partyRefreshEmit(res.data)
            }

        } catch (e) {
            console.log(e)
            alert(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

export const activateOrder = (order, token) => {
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

            const res = await axios.patch('/product/activate', {order: arrayOrder, token})
            dispatch({type: 'UPDATE_ACTIVE_ORDER', activeOrder: res.data })

        } catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

export const cancelOrder = () => {
    return async dispatch => {
        try {
            
            await axios.patch('/product/cancel')
            dispatch({type: 'UPDATE_ACTIVE_ORDER', activeOrder: [] })

        } catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

