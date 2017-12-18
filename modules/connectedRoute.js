import React from 'react'
import {connect} from 'react-redux'
import {createMatchSelector} from 'react-router-redux'

const renderNothingIfNoMatch = Component => props =>
  !props.match ? null : <Component {...props} />

export default (path, alwaysRender = false) => {
  const selector = createMatchSelector(path)
  const matcher = connect(state => ({match: selector(state)}), {})
  return alwaysRender ? matcher : C => matcher(renderNothingIfNoMatch(C))
}
