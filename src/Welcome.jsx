import React from 'react';
import { Jumbotron, Grid, Row, Col, Image } from 'react-bootstrap';
import business from '../public/assets/coworkers.jpg';
import family from '../public/assets/family.jpg';
import friends from '../public/assets/friends.jpg';


export default class Welcome extends React.Component {
  render() {
    return (
      <Grid>
        <Jumbotron>
          <h2>Welcome to CampFire.</h2>
          <p>The (camp)site to help you cultivate better relationships and keep your contacts warm!</p>
        </Jumbotron>
        <Row className="show-grid text-center">
          <Col xs={12} sm={4} className="person-wrapper">
            <Image src={business} circle className="profile-pic" />
            <h3>Business</h3>
          </Col>
          <Col xs={12} sm={4} className="person-wrapper">
            <Image src={family} circle className="profile-pic" />
            <h3>Family</h3>
          </Col>
          <Col xs={12} sm={4} className="person-wrapper">
            <Image src={friends} circle className="profile-pic" />
            <h3>Friends</h3>
          </Col>
        </Row>
      </Grid>
    )
  }
};