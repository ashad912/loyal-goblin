import React from 'react'
import moxios from 'moxios'

import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect' // To have extra methods like: toBeInTheDocument()

import ReduxRoot from 'ReduxRoot'
import Shop from 'components/shop/Shop'

import {initState as authInit} from 'store/reducers/authReducer'
import {initState as shopInit} from 'store/reducers/shopReducer'
import {initState as partyInit} from 'store/reducers/partyReducer'


beforeEach(async (done) => {

    moxios.install()

    // Do not work with specific path...
    
    const initialState = {
        auth: {
            ...authInit,
            uid: 'uid',
            profile: {
                activeOrder: [],
                bag: [],
                equipped: {}
            }
        },
        shop: shopInit,
        party: partyInit,
    }

    const {container} = render(
        <ReduxRoot initialState={initialState}>
            <Shop location={{state: {id: 'uid'}}}/>
        </ReduxRoot>
    )
    
   
    screen.container = container

    moxios.wait(async () => {
        const request = moxios.requests.at(0) //.at(0) or .mostRecent() if last
        
        await request.respondWith({
          status: 200,
          response: {shop: [], activeOrder: [], party: {...partyInit}, userPerks: { products: []}}
        })
        await waitFor(() => screen.getByRole('application'))
        done()
    })
    
})


it('shows all six positions in section bar', async () => {
    //await waitFor(() => screen.getByTestId('application'))
    expect(screen.getByTestId('shots')).toBeInTheDocument()
    expect(screen.getByTestId('drinks')).toBeInTheDocument()
    expect(screen.getByTestId('beers')).toBeInTheDocument()
    expect(screen.getByTestId('alco-free')).toBeInTheDocument()
    expect(screen.getByTestId('food')).toBeInTheDocument()
    expect(screen.getByTestId('others')).toBeInTheDocument()
})

it('shows all six sections lists', async () => {
    //await waitFor(() => screen.getByTestId('application'))
    expect(screen.getByTestId('shots-list')).toBeInTheDocument()
    expect(screen.getByTestId('food-list')).toBeInTheDocument()
    expect(screen.getByTestId('beers-list')).toBeInTheDocument()
    expect(screen.getByTestId('alco-free-list')).toBeInTheDocument()
    expect(screen.getByTestId('food-list')).toBeInTheDocument()
    expect(screen.getByTestId('others-list')).toBeInTheDocument()
})

afterEach(() => {
    moxios.uninstall()
})
