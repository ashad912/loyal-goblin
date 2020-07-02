import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect' // To have extra methods like: toBeInTheDocument()

import ReduxRoot from 'ReduxRoot'
import Shop from 'components/shop/Shop'

import {initState as authInit} from 'store/reducers/authReducer'
import {initState as shopInit} from 'store/reducers/shopReducer'
import {initState as partyInit} from 'store/reducers/partyReducer'
import MissionInstance from '../MissionInstance'


const amulets = [
    {
        _id: 'id',
        quantity: 1,
        itemModel: {
            _id: 'aid',
            imgSrc: 'src'
        }
    }
]

const missionInstance = {
    mission: {
        _id: 'id',
        title: 'Mission',
        description: 'desc',
        imgSrc: 'src',
        amulets: [
            amulets[0]
        ],
        unique: false
    },
    party: [
        {
            profile: {
                _id: 'uid'
            },
            inMission: false,
            readyStatus: false
        }
    ],
    items: []
    
}



const server = setupServer(
    rest.patch('*', (req, res, ctx) => { // Do not work with specific path...
      return res(
          ctx.json({missionInstance, amulets}),
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
        party: partyInit,
    }

    const {container} = render(
        <ReduxRoot initialState={initialState}>
            <MissionInstance uid='uid' location={{state: {id: 'uid'}}}/>
        </ReduxRoot>
    )
    

    screen.container = container
    await waitFor(() => screen.getByRole('application'))
    
})


it('shows all sections', () => {
    expect(screen.getByTestId('mission-info')).toBeInTheDocument()
    expect(screen.getByRole('section', {name: 'amulets-bar'})).toBeInTheDocument()
    expect(screen.getByTestId('exchange-area')).toBeInTheDocument()
    expect(screen.getByTestId('party-list')).toBeInTheDocument()
    expect(screen.getByTestId('button-bar')).toBeInTheDocument()
})

// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers())


// clean up once the tests are done
afterAll(() => server.close())
