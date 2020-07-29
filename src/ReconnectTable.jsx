import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { LinkContainer, Link } from 'react-router-bootstrap';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';

import UserContext from './UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class ContactRowPlain extends React.Component {
  render() {
    const { contact, location: { search }, reconnectContact, index } = this.props;
    const user = this.context;
    const disabled = !user.signedIn;

    const selectLocation = { pathname: `/dashboard/${contact.id}`, search };
    //TOOLTIP NOT NEEDED
    const editTooltip = (
      <Tooltip id="close-tooltip" placement="top">ReConnect</Tooltip>
    );
    // const closeTooltip = (
    //   <Tooltip id="close-tooltip" placement="top">Close Issue</Tooltip>
    // );
    // const deleteTooltip = (
    //   <Tooltip id="delete-tooltip" placement="top">Delete Issue</Tooltip>
    // );

  


    // function onClose(e) {
    //   e.preventDefault();
    //   reconnect(index);
    // }

    function onReconnectClick(e, id) {
      e.preventDefault();
      reconnectContact(index);
      console.log(id);
      //Redirect should work?!?!? wtf?
      // return <Redirect to={`/edit/${id}`}/>
      window.location.href='/edit/' + id;
    }

    // onReconnectClick = () => {
    //   e.preventDefault();
    //   reconnectContact(index);
    //   this.props.history.push('/report')
    // }

    // function onDelete(e) {
    //   e.preventDefault();
    //   deleteIssue(index);
    // }

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
        {/* <td>{issue.company}</td>
        <td>{issue.title}</td>
        <td>{issue.frequency}</td>
        <td>{issue.email}</td>
        <td>{issue.Linkedin}</td> */}
        <td>{contact.priority}</td>
        {/* Added Placeholders for  Familiarity and Context */}
        {/* <td>{issue.familiarity}</td> */}
        <td>{contact.contextSpace}</td>
        <td>
          {/* <Link to={`/edit/${issue.id}`} > */}
            {/* TO DO: (suggestion) I think we might need an onclick handler on the button, so that we can differentiate the behavior
            between just clicking an edit and being redirected to the edit page via clicking this button
            - to set the lastContactDate to the current Date()*/}
            {/* TO DO: figure out how to make onClick work with link. Now correct graphql mutation,
             but the button does not redirect. I tried with with and without link container*/}
            <OverlayTrigger delayShow={1000} overlay={editTooltip} >
              <Button bsStyle="primary" onClick={(e)=>onReconnectClick(e, contact.id)}>
                Reconnect!
              </Button>
            </OverlayTrigger>
          {/* </Link> */}
          {' '}
          {/* <OverlayTrigger delayShow={1000} overlay={closeTooltip}>
            <Button disabled={disabled} bsSize="xsmall" onClick={onClose}>
              <Glyphicon glyph="remove" />
            </Button>
          </OverlayTrigger>
          {' '}
          <OverlayTrigger delayShow={1000} overlay={deleteTooltip}>
            <Button disabled={disabled} bsSize="xsmall" onClick={onDelete}>
              <Glyphicon glyph="trash" />
            </Button>
          </OverlayTrigger> */}
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

export default function IssueTable({ contacts, reconnectContact }) {
  const contactRows = contacts.map((contact, index) => (
    <ContactRow
      key={contact.id}
      contact={contact}
      reconnectContact={reconnectContact}
      // deleteIssue={deleteIssue}
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
          {/* <th>Company</th>
          <th>Title</th>
          <th>Frequency</th>
          <th>Email</th>
          <th>Linkedin</th> */}
          <th>Priority</th>
          {/* <th>Familiarity</th>  */}
          <th>Context</th>
          <th>Contact</th>
        </tr>
      </thead>
      <tbody>
        {contactRows}
      </tbody>
    </Table>
  );
}
