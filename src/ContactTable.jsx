import React from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'

import UserContext from './UserContext.js';
import Toggle from 'react-toggle';

// eslint-disable-next-line react/prefer-stateless-function
class ContactRowPlain extends React.Component {
  render() {
    const {
      contact, location: { search }, toggleActiveStatus, deleteContact, index,
    } = this.props;
    const user = this.context;
    const disabled = !user.signedIn;


    const selectLocation = { pathname: `/contacts/${contact.id}`, search };
    const editTooltip = (
      <Tooltip id="close-tooltip" placement="top">Edit Contact</Tooltip>
    );
    const closeTooltip = (
      <Tooltip id="close-tooltip" placement="top">Active/Inactive Contact Toggle</Tooltip>
    );
    
    const deleteTooltip = (
      <Tooltip id="delete-tooltip" placement="top">Delete Contact</Tooltip>
    );

    const linkedinTooltip = (
      <Tooltip id="linkedin-tooltip" placement="top">Open LinkedIn</Tooltip>
    );

    function onToggle(e) {
      e.preventDefault();
      toggleActiveStatus(index);
    }


    function onDelete(e) {
      e.preventDefault();
      deleteContact(index);
    }

    function openLinkedIn(e, LinkedIn) {
      e.preventDefault();
      window.open(LinkedIn, '_blank');
    }

    const tableRow = (
      <tr>
        <td>{contact.name}</td>
        <td>{contact.company}</td>
        <td>{contact.title}</td>
        <td>{contact.contactFrequency}</td>
        <td>{contact.email}</td>
        <td>
        <OverlayTrigger delayShow={1000} overlay={linkedinTooltip}>
          <Button bsSize="xsmall" onClick={(e)=>openLinkedIn(e, contact.LinkedIn)}>
              {/* <Glyphicon glyph="new-window" /> */}
              <FontAwesomeIcon icon={faLinkedin} />
          </Button>
        </OverlayTrigger>
        </td>
        <td>{contact.priority}</td>
        <td>{contact.familiarity}</td>
        <td>{contact.contextSpace}</td>
        <td>
          <OverlayTrigger delayShow={1000} overlay={closeTooltip}>
              <Toggle
                id='close-tooltip'
                disabled={disabled}
                checked={contact.activeStatus}
                onChange={onToggle} />
          </OverlayTrigger>
          {'  '}
          <LinkContainer to={`/edit/${contact.id}`}>
            <OverlayTrigger delayShow={1000} overlay={editTooltip}>
              <Button bsSize="xsmall">
                <Glyphicon glyph="edit" />
              </Button>
            </OverlayTrigger>
          </LinkContainer>
          {' '}
          <OverlayTrigger delayShow={1000} overlay={deleteTooltip}>
            <Button disabled={disabled} bsSize="xsmall" onClick={onDelete}>
              <Glyphicon glyph="trash" />
            </Button>
          </OverlayTrigger>
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

export default function ContactTable({ contacts, toggleActiveStatus, deleteContact }) {
  const contactRows = contacts.map((contact, index) => (
    <ContactRow
      key={contact.id}
      contact={contact}
      toggleActiveStatus={toggleActiveStatus}
      deleteContact={deleteContact}
      index={index}
    />
  ));

  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Company</th>
          <th>Title</th>
          <th>Frequency</th>
          <th>Email</th>
          <th>Linkedin</th>
          <th>Priority</th>
          <th>Familiarity</th>
          <th>Context</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {contactRows}
      </tbody>
    </Table>
  );
}
