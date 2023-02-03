import { Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router'
import React from 'react';

const authenticate = () => {
    return localStorage.getItem("TOKEN") != null
}

const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        authenticate() === true
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  )

export default withRouter(ProtectedRoute)