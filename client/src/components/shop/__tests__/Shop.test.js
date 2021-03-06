import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

import ReduxRoot from 'ReduxRoot'
import Shop from 'components/shop/Shop'

import { initState as authInit } from 'store/reducers/authReducer'
import { initState as shopInit } from 'store/reducers/shopReducer'
import { initState as partyInit } from 'store/reducers/partyReducer'


const server = setupServer(
    // Does not work with specific path for axios 0.19.0 - need to use "*" as url
    // Fixed for axios 0.19.2!
    rest.get('/product/shop', (req, res, ctx) => {
        return res(
            ctx.json({ shop: [], activeOrder: [], party: { ...partyInit }, userPerks: { products: [] } }),
            ctx.status(200)
        )
    })
)


// establish API mocking before all tests
beforeAll(() => server.listen())

beforeEach(async () => {

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

    const { container } = render(
        <ReduxRoot initialState={initialState}>
            <Shop location={{ state: { id: 'uid' } }} />
        </ReduxRoot>
    )


    screen.container = container
    await waitFor(() => screen.getByRole('application'))

})


it('shows all six positions in section bar', () => {
    expect(screen.getByTestId('shots')).toBeInTheDocument()
    expect(screen.getByTestId('drinks')).toBeInTheDocument()
    expect(screen.getByTestId('beers')).toBeInTheDocument()
    expect(screen.getByTestId('alco-free')).toBeInTheDocument()
    expect(screen.getByTestId('food')).toBeInTheDocument()
    expect(screen.getByTestId('others')).toBeInTheDocument()
})

it('shows all six sections lists', () => {
    expect(screen.getByTestId('shots-list')).toBeInTheDocument()
    expect(screen.getByTestId('food-list')).toBeInTheDocument()
    expect(screen.getByTestId('beers-list')).toBeInTheDocument()
    expect(screen.getByTestId('alco-free-list')).toBeInTheDocument()
    expect(screen.getByTestId('food-list')).toBeInTheDocument()
    expect(screen.getByTestId('others-list')).toBeInTheDocument()
})

// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers())


// clean up once the tests are done
afterAll(() => server.close())
