import {connect} from 'react-redux'

export default connect(state => ({location: state.router.location || {}}), {})
