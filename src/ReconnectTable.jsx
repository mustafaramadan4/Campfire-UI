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
    const {
      issue, location: { search }, closeIssue, deleteIssue, index,
    } = this.props;
    const user = this.context;
    const disabled = !user.signedIn;

    const selectLocation = { pathname: `/dashboard/${issue.id}`, search };
    const editTooltip = (
      <Tooltip id="close-tooltip" placement="top">Re-Connect</Tooltip>
    );
    // const closeTooltip = (
    //   <Tooltip id="close-tooltip" placement="top">Close Issue</Tooltip>
    // );
    // const deleteTooltip = (
    //   <Tooltip id="delete-tooltip" placement="top">Delete Issue</Tooltip>
    // );

    function onClose(e) {
      e.preventDefault();
      closeIssue(index);
    }


    function onDelete(e) {
      e.preventDefault();
      deleteIssue(index);
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
        <td>{issue.name}</td>
        {/* <td>{issue.company}</td>
        <td>{issue.title}</td>
        <td>{issue.frequency}</td>
        <td>{issue.email}</td>
        <td>{issue.Linkedin}</td> */}
        <td>{issue.priority}</td>
        {/* Added Placeholders for  Familiarity and Context */}
        {/* <td>{issue.familiarity}</td> */}
        {/* <td>{issue.context}</td> */}
        <td>
          <LinkContainer to={`/edit/${issue.id}`}>
            <OverlayTrigger delayShow={1000} overlay={editTooltip}>
              <Button bsStyle="primary">
                Reconnect!
              </Button>
            </OverlayTrigger>
          </LinkContainer>
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

export default function IssueTable({ issues, closeIssue, deleteIssue }) {
  const issueRows = issues.map((issue, index) => (
    <IssueRow
      key={issue.id}
      issue={issue}
      closeIssue={closeIssue}
      deleteIssue={deleteIssue}
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
          {/* <th>Familiarity</th>
          <th>Context</th> */}
          <th>Contact</th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </Table>
  );
}
