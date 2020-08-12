import React from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Table,
} from 'react-bootstrap';

import UserContext from './UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class ContactRowPlain extends React.Component {
  render() {
    const {
      contact, location: { search }, reconnectContact, index,
    } = this.props;
    const user = this.context;
    const disabled = !user.signedIn;

    const selectLocation = { pathname: `/dashboard/${contact.id}`, search };
   
    function onReconnectClick(e, id) {
      e.preventDefault();
      reconnectContact(index);
      window.location.href='/edit/' + id; // Redirects to Edit page of particular id
    }

    const tableRow = (
      <tr>
        <td>{contact.name}</td>
        <td>{contact.priority}</td>
        <td>{contact.contextSpace}</td>
        <td>
          <Button bsStyle="primary" onClick={(e)=>onReconnectClick(e, contact.id)}>
            Reconnect!
          </Button>
          {' '}
        </td>
      </tr>
    );
    return (
      <LinkContainer to={selectLocation}>
        {tableRow}
      </LinkContainer>
    );
  }
}

ContactRowPlain.contextType = UserContext;
const ContactRow = withRouter(ContactRowPlain);
delete ContactRow.contextType;

export default function ReconnectTable({ contacts, reconnectContact }) {
  const contacRows = contacts.map((contact, index) => (
    <ContactRow
      key={contact.id}
      contact={contact}
      reconnectContact={reconnectContact}
      index={index}
    />
  ));

  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Priority</th>
          <th>Context</th>
          <th>Contact</th>
        </tr>
      </thead>
      <tbody>
        {contacRows}
      </tbody>
    </Table>
  );
}