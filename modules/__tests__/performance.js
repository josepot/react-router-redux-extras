import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, combineReducers} from 'redux'
import {Redirect} from 'react-router'
import {ConnectedRouter, routerReducer} from 'react-router-redux'
import createHistory from 'history/createMemoryHistory'
import {Provider as ReduxProvider} from 'react-redux'
import Route from '../Route'
import Switch from '../Switch'

describe('performance', () => {
  let store, history, MemoryRouter

  beforeEach(() => {
    store = createStore(
      combineReducers({
        router: routerReducer,
      })
    )

    MemoryRouter = ({children, ...rest}) => {
      history = createHistory(rest)
      return (
        <ReduxProvider store={store}>
          <ConnectedRouter history={history}>{children}</ConnectedRouter>
        </ReduxProvider>
      )
    }
  })

  it('performs on recursives routes', () => {
    let nRenders = 0
    const TestComponent = ({match}) => {
      nRenders++
      return (
        <div>
          Path: {match.path}
          <Route path={`${match.url}/:id`} component={TestComponent} />
        </div>
      )
    }
    const node = document.createElement('div')

    ReactDOM.render(
      <MemoryRouter initialEntries={['/']}>
        <Switch>
          <Route path="/:id" component={TestComponent} />
          <Redirect to="/1" />
        </Switch>
      </MemoryRouter>,
      node
    )

    expect(nRenders).toBe(1)

    history.push('/1/2')
    expect(nRenders).toBe(2)

    history.push('/1/2/3')
    expect(nRenders).toBe(3)

    history.push('/1/2/3/4')
    expect(nRenders).toBe(4)

    history.push('/1/2/3/4/5')
    expect(nRenders).toBe(5)

    history.push('/1/2/3/4/5/6')
    expect(nRenders).toBe(6)

    history.push('/1/2')
    expect(nRenders).toBe(6)
  })
})
