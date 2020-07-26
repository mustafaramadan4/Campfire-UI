import React from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';

import UserContext from './UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class IssueRowPlain extends React.Component {
  render() {
    // const {
    //   issue, location: { search }, closeIssue, deleteIssue, index,
    // } = this.props;
    const {
      contact, location: { search }, deactivateContact, deleteContact, index,
    } = this.props;
    const user = this.context;
    const disabled = !user.signedIn;

    const selectLocation = { pathname: `/issues/${contact.id}`, search };
    const editTooltip = (
      <Tooltip id="close-tooltip" placement="top">Edit Contact</Tooltip>
    );
    const closeTooltip = (
      <Tooltip id="close-tooltip" placement="top">Active/Inactive Contact Toggle</Tooltip>
    );
    const deleteTooltip = (
      <Tooltip id="delete-tooltip" placement="top">Delete Contact</Tooltip>
    );

    function onDeactivate(e) {
      /* TODO: refer to IssueList.jsx line 170, we can use the props to access the activeStatus of a contact 
      * and further develop as a toggle button. DONE: Implemented on/off on same button with success message.
      * FIXED weird behavior with data in the table.
      */
      if (contact.activeStatus === true) {
        console.log("activeStatus is: " + contact.activeStatus);
      } else {
        console.log("activeStatus is: " + contact.activeStatus);
      }
      e.preventDefault();
      deactivateContact(index);
    }


    function onDelete(e) {
      e.preventDefault();
      deleteContact(index);
    }

    const tableRow = (
      <tr>
        {/* <td>{issue.id}</td>
        <td>{issue.status}</td>
        <td>{issue.owner}</td>
        <td>{issue.created.toDateString()}</td>
        <td>{issue.effort}</td>
        <td>{issue.due ? issue.due.toDateString() : ''}</td>
        <td>{issue.title}</td> */}
        <td>{contact.name}</td>
        <td>{contact.company}</td>
        <td>{contact.title}</td>
        <td>{contact.frequency}</td>
        <td>{contact.email}</td>
        <td>{contact.Linkedin}</td>
        <td>{contact.priority}</td>
        <td>{contact.familiarity}</td>
        <td>{contact.context}</td>
        <td>
          <LinkContainer to={`/edit/${contact.id}`}>
            <OverlayTrigger delayShow={1000} overlay={editTooltip}>
              <Button bsSize="xsmall">
                <Glyphicon glyph="edit" />
              </Button>
            </OverlayTrigger>
          </LinkContainer>
          {' '}
          <OverlayTrigger delayShow={1000} overlay={closeTooltip}>
            <Button disabled={disabled} bsSize="xsmall" onClick={onDeactivate}>
              <Glyphicon glyph="off" />
            </Button>
          </OverlayTrigger>
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

IssueRowPlain.contextType = UserContext;
const IssueRow = withRouter(IssueRowPlain);
delete IssueRow.contextType;

export default function IssueTable({ contacts, deactivateContact, deleteContact }) {
  const issueRows = contacts.map((contact, index) => (
    <IssueRow
      key={contact.id}
      contact={contact}
      deactivateContact={deactivateContact}
      deleteContact={deleteContact}
      index={index}
    />
  ));

  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          {/* <th>ID</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Due Date</th>
          <th>Title</th>
          <th>Action</th> */}
          {/* Modified for Campfire Contact object */}
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
        {issueRows}
      </tbody>
    </Table>
  );
}
