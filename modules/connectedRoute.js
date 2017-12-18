import React from 'react'
import {connect} from 'react-redux'
import {createMatchSelector} from 'react-router-redux'

const renderNothingIfNoMatch = Component => props =>
  !props.match ? null : <Component {...props} />

export default (path, alwaysRender = false) => {
  const matcher = connect(
    state => ({match: createMatchSelector(path)(state)}),
    {}
  )
  return alwaysRender ? matcher : C => matcher(renderNothingIfNoMatch(C))
}
