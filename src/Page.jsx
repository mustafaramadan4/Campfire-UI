import React from 'react';
import {
  Navbar, Nav, NavItem, NavDropdown,
  MenuItem, Glyphicon,
  Grid, Col, Image
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import Contents from './Contents.jsx';
import IssueAddNavItem from './IssueAddNavItem.jsx';
import SignInNavItem from './SignInNavItem.jsx';
import Search from './Search.jsx';
import UserContext from './UserContext.js';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';
import logo from './logo.png';
// import './Page.css'; TO DO: Figure out why CSS loader not working.

// TO DO: import styled components??

function NavBar({ user, onUserChange }) {
  return (
    // TO DO: FIGURE OUT HOW TO SCALE LOGO & Orient Nav Bar
    // <Image src={logo} width={"50"} height={"50"}/>
    <Navbar fluid>
      <Navbar.Header>
        {/* <Navbar.Brand>CampFire</Navbar.Brand> */}
          <Navbar.Brand><Link to="/dashboard"><img src={logo} style={{width:'100px', height: '100px', padding: '0px', style: 'object-fit'}}/></Link></Navbar.Brand>
      </Navbar.Header>
      <Nav>
        {/* <LinkContainer exact to="/">
          <NavItem>Home</NavItem>
        </LinkContainer> */}
        <LinkContainer to="/dashboard">
          <NavItem>Dashboard</NavItem>
        </LinkContainer>
        <LinkContainer to="/issues">
          <NavItem >Contacts</NavItem>
        </LinkContainer>
        {/* <LinkContainer to="/report">
          <NavItem>Report</NavItem>
        </LinkContainer> */}
      </Nav>
      <Col sm={5}>
        <Navbar.Form>
          <Search user={user}/>
        </Navbar.Form>
      </Col>
      <Nav pullRight>
        <IssueAddNavItem user={user} />
        <SignInNavItem user={user} onUserChange={onUserChange} />
        <NavDropdown
          id="user-dropdown"
          title={<Glyphicon glyph="option-vertical" />}
          noCaret
        >
          <LinkContainer to="/about">
            <MenuItem>About</MenuItem>
          </LinkContainer>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
}

function Footer() {
  return (
    <small>
      <hr />
      <p className="text-center">
        Full source code available at this
        {' '}
        {/*TO DO: Change Repo address*/}
        <a href="https://github.com/vasansr/pro-mern-stack-2">
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
