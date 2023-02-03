import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Client from './pages/Client';
import Counselor from './pages/Counselor';
import NotFound from './pages/NotFound';
import Report from './pages/Report';
import ProtectedRoute from './shared/ProtectedRoute';
import Login from './pages/Login';
import logo from './assets/logo_konselink.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';
import { Route, Switch, BrowserRouter as Router, NavLink, Redirect } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem } from 'react-bootstrap';
import ClientDetail from './pages/ClientDetail';

const LoginContainer = () => (
  <Fragment>
    <Route exact path="/" component={() => <Redirect to="/client"/>}/>
    <Route path="/login" component = {Login} />
  </Fragment>
)

const DefaultContainer = () => (
  <Fragment>
  <Navbar collapseOnSelect expand="lg" className="navbar-custom" sticky="top">
  <NavbarBrand>
  <img alt="" src={logo} width="150" className="d-inline-block align-top" />{' '}
  </NavbarBrand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav" defaultActiveKey="/client" className="Navbar.Collapse">
        <Nav><NavLink to="/client" className="navbar-item" activeClassName="navbar-item-active">Client</NavLink></Nav>
        <Nav><NavLink to="/counselor" className="navbar-item" activeClassName="navbar-item-active">Counselor</NavLink></Nav>
        <Nav><NavLink to="/report" className="navbar-item" activeClassName="navbar-item-active">Report</NavLink></Nav>
        <Nav><NavLink to="/login" className="navbar-item-logout" activeClassName="navbar-item-active">Logout</NavLink></Nav>
  </Navbar.Collapse>
</Navbar>
<ProtectedRoute exact path="/" component={() => <Redirect to="/client"/>}/>
  <ProtectedRoute path="/client" component={Client}/>
  <ProtectedRoute path="/counselor" component={Counselor}/>
  <ProtectedRoute path="/report" component={Report}/>
  <ProtectedRoute path="/detail/:id" component={ClientDetail}/>
      {/* <ProtectedRoute component={NotFound} /> */}
</Fragment>
)

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/(login)" component={LoginContainer}/>
      <Route component={DefaultContainer}/>
    </Switch>
  </Router>
,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
