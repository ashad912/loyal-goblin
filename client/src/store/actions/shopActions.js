
import axios from 'axios'
import {refreshPartyEmit, refreshMissionsEmit} from '../../socket'
import {pick, cloneDeep} from 'lodash'

export const getShop = (socketStatusConnection) => {
    return async dispatch => {
        try {
            const res = await axios.get('/product/shop')
        
            
            if(socketStatusConnection !== undefined){
                if(res.data.party && res.data.party.members.length && !socketStatusConnection){ //if client of multiplayer mission is not connected to socket
                    throw new Error('Leader not connected to party members.')
                }
            }

            dispatch({type: 'GET_SHOP', shop: res.data.shop})
            dispatch({type: 'UPDATE_ACTIVE_ORDER', activeOrder: res.data.activeOrder})
            dispatch({type: "UPDATE_PARTY", party: res.data.party})
            if(res.data.party){
                refreshPartyEmit(res.data.party._id)
            }
        } catch (e) {
            console.log(e)
            if(e.message === 'Leader not connected to party members.'){
                throw new Error(e)   
            }
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
                refreshPartyEmit(res.data)
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

