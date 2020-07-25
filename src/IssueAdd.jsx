import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, FormControl, FormGroup, ControlLabel, Button,
} from 'react-bootstrap';

export default class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const contact = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      LinkedIn: form.LinkedIn.value,
      // owner: form.owner.value,
      // title: form.title.value,
      // due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    const { createIssue } = this.props;
    createIssue(contact);
    form.name.value = ''; form.email.value = ''; form.phone.value = ''; form.LinkedIn.value = '';
  }

  render() {
    return (
      <Form inline name="issueAdd" onSubmit={this.handleSubmit}>
        <FormGroup>
          <ControlLabel>Name:</ControlLabel>
          {' '}
          <FormControl type="text" name="name" />
        </FormGroup>
        {' '}
        <FormGroup>
          <ControlLabel>Email:</ControlLabel>
          {' '}
          <FormControl type="text" name="email" />
        </FormGroup>
        {' '}
        <FormGroup>
          <ControlLabel>Phone Number:</ControlLabel>
          {' '}
          <FormControl type="text" name="phone" />
        </FormGroup>
        {' '}
        <FormGroup>
          <ControlLabel>LinkedIn:</ControlLabel>
          {' '}
          <FormControl type="text" name="LinkedIn" />
        </FormGroup>
        {' '}
        <Button bsStyle="primary" type="submit">Add</Button>
      </Form>
    );
  }
}

IssueAdd.propTypes = {
  createIssue: PropTypes.func.isRequired,
};
