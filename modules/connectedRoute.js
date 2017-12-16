import {connect} from 'react-redux'
import {createMatchSelector} from 'react-router-redux'

const renderNothingIfNoMatch = Component => props =>
  !props.match ? null : Component

export default (path, alwaysRender = false) => {
  const matcher = connect(
    state => ({match: createMatchSelector(path)(state)}),
    {}
  )
  return alwaysRender ? matcher : C => renderNothingIfNoMatch(matcher(C))
}
