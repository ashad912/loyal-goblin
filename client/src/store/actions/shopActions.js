
import axios from 'axios'
import {refreshPartyEmit} from '../../socket'
import {pick, cloneDeep} from 'lodash'

export const getShop = (socketConnectionStatus) => {
    return async dispatch => {
        try {
            const res = await axios.get(`/product/shop`, {
                params: { //it is req.query, not req.params at backend -.-
                    socketConnectionStatus
                }
            })
            // const res = await axios.get('/product/shop')
            // console.log(res)
            // let res
            // res.data = await (await fetch('/product/shop')).json()
            // console.log(res.data)
            dispatch({type: 'GET_SHOP', shop: res.data.shop})
            dispatch({type: 'UPDATE_ACTIVE_ORDER', activeOrder: res.data.activeOrder})
            dispatch({type: "UPDATE_PARTY", party: res.data.party})
            dispatch({type: 'UPDATE_PERKS', userPerks: res.data.userPerks})
            if(res.data.party){
                refreshPartyEmit(res.data.party._id)
            }
        } catch (e) {
            console.log(e.message)
            dispatch( {type: "NO_CONNECTION", error: e})  
            throw new Error(e)
        }
    }
}

export const leaveShop = () => {
    return async dispatch => {
        try {
            const res = await axios.patch('/product/leave')

            dispatch({type: 'LEAVE_SHOP'})
            if(res.data){
                refreshPartyEmit(res.data)
            }

        } catch (e) {
            console.log(e)
            alert(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

export const activateOrder = (order, recaptcha) => {
    return async dispatch => {
        try {
            const tempOrder = cloneDeep(order)
            const arrayOrder = Object.keys(tempOrder).map(user => {
                // order[user].map(product => {
                //     product.product = product._id
                //     //delete product._id
                //     product = pick(product, ['product', 'quantity'])
                //     console.log(product)
                //     return(product)
                // });
                
                for(let i=0; i<tempOrder[user].length; i++){
                    tempOrder[user][i].product = tempOrder[user][i]._id
                    tempOrder[user][i] = pick(tempOrder[user][i], ['product', 'quantity'])
                }

               // console.log(tempOrder[user])
                return {profile: user, products: tempOrder[user]}
            })

            const res = await axios.patch('/product/activate', {order: arrayOrder, recaptcha})
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

