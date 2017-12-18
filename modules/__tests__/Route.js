import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, combineReducers} from 'redux'
import {ConnectedRouter, routerReducer} from 'react-router-redux'
import createHistory from 'history/createMemoryHistory'
import {Provider as ReduxProvider} from 'react-redux'
import Route from '../Route'

describe('Route', () => {
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

  describe('A <Route>', () => {
    it('renders at the root', () => {
      const TEXT = 'Mrs. Kato'
      const node = document.createElement('div')

      ReactDOM.render(
        <MemoryRouter initialEntries={['/']}>
          <Route path="/" render={() => <h1>{TEXT}</h1>} />
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).toContain(TEXT)
    })

    it('does not render when it does not match', () => {
      const TEXT = 'bubblegum'
      const node = document.createElement('div')

      ReactDOM.render(
        <MemoryRouter initialEntries={['/bunnies']}>
          <Route path="/flowers" render={() => <h1>{TEXT}</h1>} />
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).not.toContain(TEXT)
    })

    it('can use a `location` prop instead of `context.router.route.location`', () => {
      const TEXT = 'tamarind chutney'
      const node = document.createElement('div')

      ReactDOM.render(
        <MemoryRouter initialEntries={['/mint']}>
          <Route
            location={{pathname: '/tamarind'}}
            path="/tamarind"
            render={() => <h1>{TEXT}</h1>}
          />
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).toContain(TEXT)
    })

    it('supports preact by nulling out children prop when empty array is passed', () => {
      const TEXT = 'Mrs. Kato'
      const node = document.createElement('div')

      ReactDOM.render(
        <MemoryRouter initialEntries={['/']}>
          <Route path="/" render={() => <h1>{TEXT}</h1>}>
            {[]}
          </Route>
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).toContain(TEXT)
    })

    it('matches using nextContext when updating', () => {
      const node = document.createElement('div')

      let push
      ReactDOM.render(
        <MemoryRouter initialEntries={['/sushi/california']}>
          <Route
            path="/sushi/:roll"
            render={({match}) => {
              push = history.push
              return <div>{match.url}</div>
            }}
          />
        </MemoryRouter>,
        node
      )
      push('/sushi/spicy-tuna')
      expect(node.innerHTML).toContain('/sushi/spicy-tuna')
    })

    it('throws with no <Router>', () => {
      const node = document.createElement('div')

      spyOn(console, 'error')

      expect(() => {
        ReactDOM.render(<Route path="/" render={() => null} />, node)
      }).toThrow()
    })
  })

  describe('A <Route> with dynamic segments in the path', () => {
    it('decodes them', () => {
      const node = document.createElement('div')
      ReactDOM.render(
        <MemoryRouter initialEntries={['/a%20dynamic%20segment']}>
          <Route
            path="/:id"
            render={({match}) => <div>{match.params.id}</div>}
          />
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).toContain('a dynamic segment')
    })
  })

  describe('A unicode <Route>', () => {
    it('is able to match', () => {
      const node = document.createElement('div')
      ReactDOM.render(
        <MemoryRouter initialEntries={['/パス名']}>
          <Route path="/パス名" render={({match}) => <div>{match.url}</div>} />
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).toContain('/パス名')
    })
  })

  describe('<Route render>', () => {
    const node = document.createElement('div')

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(node)
    })

    it('renders its return value', () => {
      const TEXT = 'Mrs. Kato'
      const node = document.createElement('div')
      ReactDOM.render(
        <MemoryRouter initialEntries={['/']}>
          <Route path="/" render={() => <div>{TEXT}</div>} />
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).toContain(TEXT)
    })

    it('receives { match } props', () => {
      let actual = null

      ReactDOM.render(
        <MemoryRouter initialEntries={['/']}>
          <Route path="/" render={props => (actual = props) && null} />
        </MemoryRouter>,
        node
      )

      expect(typeof actual.match).toBe('object')
    })
  })

  describe('<Route component>', () => {
    const node = document.createElement('div')

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(node)
    })

    it('renders the component', () => {
      const TEXT = 'Mrs. Kato'
      const node = document.createElement('div')
      const Home = () => <div>{TEXT}</div>
      ReactDOM.render(
        <MemoryRouter initialEntries={['/']}>
          <Route path="/" component={Home} />
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).toContain(TEXT)
    })

    it('receives { match } props', () => {
      let actual = null
      const Component = props => (actual = props) && null

      ReactDOM.render(
        <MemoryRouter initialEntries={['/']}>
          <Route path="/" component={Component} />
        </MemoryRouter>,
        node
      )

      expect(typeof actual.match).toBe('object')
    })
  })

  describe('<Route children>', () => {
    const node = document.createElement('div')

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(node)
    })

    it('renders a function', () => {
      const TEXT = 'Mrs. Kato'
      const node = document.createElement('div')
      ReactDOM.render(
        <MemoryRouter initialEntries={['/']}>
          <Route path="/" children={() => <div>{TEXT}</div>} />
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).toContain(TEXT)
    })

    it('renders a child element', () => {
      const TEXT = 'Mrs. Kato'
      const node = document.createElement('div')
      ReactDOM.render(
        <MemoryRouter initialEntries={['/']}>
          <Route path="/">
            <div>{TEXT}</div>
          </Route>
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).toContain(TEXT)
    })

    it('receives { match } props', () => {
      let actual = null

      ReactDOM.render(
        <MemoryRouter initialEntries={['/']}>
          <Route path="/" children={props => (actual = props) && null} />
        </MemoryRouter>,
        node
      )

      expect(typeof actual.match).toBe('object')
    })
  })

  describe('A <Route exact>', () => {
    it('renders when the URL does not have a trailing slash', () => {
      const TEXT = 'bubblegum'
      const node = document.createElement('div')

      ReactDOM.render(
        <MemoryRouter initialEntries={['/somepath/']}>
          <Route exact path="/somepath" render={() => <h1>{TEXT}</h1>} />
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).toContain(TEXT)
    })

    it('renders when the URL has trailing slash', () => {
      const TEXT = 'bubblegum'
      const node = document.createElement('div')

      ReactDOM.render(
        <MemoryRouter initialEntries={['/somepath']}>
          <Route exact path="/somepath/" render={() => <h1>{TEXT}</h1>} />
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).toContain(TEXT)
    })
  })

  describe('A <Route exact strict>', () => {
    it('does not render when the URL has a trailing slash', () => {
      const TEXT = 'bubblegum'
      const node = document.createElement('div')

      ReactDOM.render(
        <MemoryRouter initialEntries={['/somepath/']}>
          <Route exact strict path="/somepath" render={() => <h1>{TEXT}</h1>} />
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).not.toContain(TEXT)
    })

    it('does not render when the URL does not have a trailing slash', () => {
      const TEXT = 'bubblegum'
      const node = document.createElement('div')

      ReactDOM.render(
        <MemoryRouter initialEntries={['/somepath']}>
          <Route
            exact
            strict
            path="/somepath/"
            render={() => <h1>{TEXT}</h1>}
          />
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).not.toContain(TEXT)
    })
  })

  describe('A <Route location>', () => {
    it('can use a `location` prop instead of `router.location`', () => {
      const TEXT = 'tamarind chutney'
      const node = document.createElement('div')

      ReactDOM.render(
        <MemoryRouter initialEntries={['/mint']}>
          <Route
            location={{pathname: '/tamarind'}}
            path="/tamarind"
            render={() => <h1>{TEXT}</h1>}
          />
        </MemoryRouter>,
        node
      )

      expect(node.innerHTML).toContain(TEXT)
    })
  })
})
