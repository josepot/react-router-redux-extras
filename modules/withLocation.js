import {connect} from 'react-redux'

export default connect(
  state => ({
    location: state.router.location || {},
    routerMatch: state.router.match,
  }),
  {},
  ({location, routerMatch}, a, {location: externalLocation, ...rest}) => ({
    ...rest,
    routerMatch,
    location: externalLocation || location,
  })
)
