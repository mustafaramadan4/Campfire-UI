import React from 'react';
import {
  Navbar, Nav, NavItem, NavDropdown,
  MenuItem, Glyphicon,
  Grid, Col
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Contents from './Contents.jsx';
import ContactAddNavItem from './ContactAddNavItem.jsx';
import SignInNavItem from './SignInNavItem.jsx';
import Search from './Search.jsx';
import UserContext from './UserContext.js';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';
import logo from './logo.png';
import Toast from './Toast.jsx';



class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toastVisible: false, toastMessage: '', toastType: 'danger',
    };
    this.dismissToast = this.dismissToast.bind(this);
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  verifySignIn(e, user) {
    const message = 'Please Sign In!';
    if (!user.signedIn) {
      this.setState({ toastVisible: true, toastMessage: message});
    }
  }

  render() {
    const {user, onUserChange} = this.props;
    const { toastType, toastVisible, toastMessage } = this.state;
    return (
    <React.Fragment>
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <img id="brand-image" src={logo} />
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        </Navbar.Header>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <LinkContainer to="/dashboard">
              <NavItem
                onClick = {(e)=>this.verifySignIn(e, user)}
                >
                  Dashboard
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/contacts">
              <NavItem
                onClick = {(e)=>this.verifySignIn(e, user)}
                >
                  Contacts
              </NavItem>
            </LinkContainer>
          </Nav>
          <Col sm={5}>
            <Navbar.Form>
              <Search user={user}/>
            </Navbar.Form>
          </Col>
          <Nav pullRight>
            <ContactAddNavItem user={user} />
            <SignInNavItem user={user} onUserChange={onUserChange} />
            <NavDropdown
              id="user-dropdown"
              title={<Glyphicon glyph="option-vertical" />}
              noCaret
            >
              <LinkContainer to="/about">
                <MenuItem
                  onClick = {(e)=>this.verifySignIn(e, user)}
                  >
                    About
                </MenuItem>
              </LinkContainer>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Toast
        bsStyle={toastType}
        showing={toastVisible}
        onDismiss={this.dismissToast}
      >
        {toastMessage}
      </Toast>
    </React.Fragment>
    );
  }
}
  
function Footer() {
  return (
    <small>
      <hr />
      <p className="text-center">
        Full source code available at this
        {' '}
        <a href="https://github.ccs.neu.edu/NEU-CS5610-SU20/GroupProject_jsonStatham_API">
          GitHub repository
        </a>
      </p>
    </small>
  );
}

export default class Page extends React.Component {
  static async fetchData(cookie) {
    const query = `query { user {
      signedIn givenName email
    }}`;
    const data = await graphQLFetch(query, null, null, cookie);
    return data;
  }

  constructor(props) {
    super(props);
    const user = store.userData ? store.userData.user : null;
    delete store.userData;
    this.state = { user };

    this.onUserChange = this.onUserChange.bind(this);
  }

  async componentDidMount() {
    const { user } = this.state;
    if (user == null) {
      const data = await Page.fetchData();
      this.setState({ user: data.user });
    }
  }

  onUserChange(user) {
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    if (user == null) return null;

    return (
      <div>
        <NavBar user={user} onUserChange={this.onUserChange} />
        <Grid fluid>
          <UserContext.Provider value={user}>
            <Contents user={user}/>
          </UserContext.Provider>
        </Grid>
        <Footer />
      </div>
    );
  }
}
