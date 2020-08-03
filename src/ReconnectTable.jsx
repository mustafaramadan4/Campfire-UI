import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { LinkContainer, Link } from 'react-router-bootstrap';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';

import UserContext from './UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class IssueRowPlain extends React.Component {
  render() {
    const {
      issue, location: { search }, reconnectContact, deleteIssue, index,
    } = this.props;
    const user = this.context;
    const disabled = !user.signedIn;

    const selectLocation = { pathname: `/dashboard/${issue.id}`, search };
    //TOOLTIP NOT NEEDED
    const editTooltip = (
      <Tooltip id="close-tooltip" placement="top">Re-Connect</Tooltip>
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
        <td>{issue.name}</td>
        {/* <td>{issue.company}</td>
        <td>{issue.title}</td>
        <td>{issue.frequency}</td>
        <td>{issue.email}</td>
        <td>{issue.Linkedin}</td> */}
        <td>{issue.priority}</td>
        {/* Added Placeholders for  Familiarity and Context */}
        {/* <td>{issue.familiarity}</td> */}
        <td>{issue.contextSpace}</td>
        <td>
          {/* <Link to={`/edit/${issue.id}`} > */}
            {/* TO DO: (suggestion) I think we might need an onclick handler on the button, so that we can differentiate the behavior
            between just clicking an edit and being redirected to the edit page via clicking this button
            - to set the lastContactDate to the current Date()*/}
            {/* TO DO: figure out how to make onClick work with link. Now correct graphql mutation,
             but the button does not redirect. I tried with with and without link container*/}
            <OverlayTrigger delayShow={1000} overlay={editTooltip} >
              <Button bsStyle="primary" onClick={(e)=>onReconnectClick(e, issue.id)}>
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

IssueRowPlain.contextType = UserContext;
const IssueRow = withRouter(IssueRowPlain);
delete IssueRow.contextType;

export default function ReconnectTable({ issues, reconnectContact }) {
  // TO DO: only show issues that are due "today"
  // FIXED: The contact's any date object field shows up as undefined - idk what's causing that issue.
  // Othe fields are recognized okay. so the passed on issues object don't have the notes and the Dates as fields. Is this a problem in Dashboard?
  // It was a problem in Dashboard, the query wasn't returning the dates.
  const testissues = issues.filter((issue) => (
    // TO DO: comparing the nextContactDate and current time to see if the difference is less than 10 days.
    // looks like it's working.
    issue.nextContactDate !== null && ((issue.nextContactDate.getTime() - Date.now())/(1000 * 60 * 60 * 24) < 10)
    ));
  
  function print(item) {
    console.log(item.name + "'s nextContactDate is: " + item.nextContactDate);
  }
  testissues.forEach(print);

  const issueRows = testissues.map((issue, index) => (
    <IssueRow
      key={issue.id}
      issue={issue}
      reconnectContact={reconnectContact}
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
        {issueRows}
      </tbody>
    </Table>
  );
}