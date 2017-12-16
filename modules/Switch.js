import React from 'react'
import PropTypes from 'prop-types'
import {matchPath} from 'react-router'
import withLocation from './withLocation'

class Switch extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props)
    this.lastPath = null
    this.lastMatch = null
    this.lastElement = null
  }

  render() {
    const {location} = this.props
    let match = null
    let matchedPath
    let child
    React.Children.forEach(this.props.children, element => {
      if (!React.isValidElement(element)) return

      const {from, path: pathProp, exact, strict, sensitive} = element.props
      const path = pathProp || from

      if (match === null) {
        child = element
        match = path
          ? matchPath(location.pathname, {
              path,
              exact,
              strict,
              sensitive,
            })
          : null
        if (match) matchedPath = path
      }
    })

    if (
      matchedPath !== this.lastPath ||
      !match ||
      !this.lastMatch ||
      match.url !== this.lastMatch.url
    ) {
      this.lastPath = matchedPath
      this.lastMatch = match
      this.lastElement = React.cloneElement(child, {
        location,
        computedMatch: match,
      })
    }
    return this.lastElement
  }
}

export default withLocation(Switch)
