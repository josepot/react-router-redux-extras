import React from 'react'
import PropTypes from 'prop-types'
import warning from 'warning'
import {matchPath} from 'react-router'
import connectedRoute from './connectedRoute'

export default class Route extends React.PureComponent {
  static propTypes = {
    computedMatch: PropTypes.object, // private, from <Switch>
    path: PropTypes.string,
    exact: PropTypes.bool,
    strict: PropTypes.bool,
    sensitive: PropTypes.bool,
    component: PropTypes.func,
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    location: PropTypes.object,
  }

  render() {
    const {
      path,
      exact,
      strict,
      sensitive,
      component,
      render,
      children,
      computedMatch,
      location,
    } = this.props

    const match =
      computedMatch ||
      (location &&
        matchPath(location.pathname, {path, exact, strict, sensitive}))

    const isChildrenFn = typeof children === 'function'
    const hasSingleChild = children && React.Children.count(children) === 1
    const isValidRender = component || render || isChildrenFn || hasSingleChild

    warning(
      isValidRender,
      '<Route> is used without a valid render option. Hint: <Route> may have only one child element'
    )

    if (!isValidRender) return null

    if (!component && !render && !isChildrenFn)
      return React.Children.only(children)

    if (match !== undefined) {
      if (isChildrenFn) return children({match})
      if (match === null) return null

      return component
        ? React.createElement(component, {match})
        : render({match})
    }

    return React.createElement(
      connectedRoute({path, exact, strict, sensitive}, isChildrenFn)(
        component || render || children
      )
    )
  }
}
