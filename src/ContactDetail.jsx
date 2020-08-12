import React from 'react';
import { Table, Button, Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'

class ContactDetail extends React.Component {
  render() {
    function openLinkedIn(e, LinkedIn) {
      e.preventDefault();
      window.open(LinkedIn, '_blank');
    }

    const linkedinTooltip = (
      <Tooltip id="linkedin-tooltip" placement="top">Open LinkedIn</Tooltip>
    );

    const { contact } = this.props;
    if (contact) {
      return (
        <div>
        <h3>Contact Details</h3>
        <Table condensed responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Linkedin</th>
              <th>Context</th>
              <th>Last contacted</th>
              <th>Next contact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{contact.name}</td>
              <td>{contact.phone}</td>
              <td>
              <OverlayTrigger delayShow={1000} overlay={linkedinTooltip}>
                <Button bsSize="xsmall" onClick={(e)=>openLinkedIn(e, contact.LinkedIn)}>
                  <FontAwesomeIcon icon={faLinkedin} />
                </Button>
              </OverlayTrigger>
              </td>
              <td>{contact.contextSpace}</td>
              <td>{contact.lastContactDate ? contact.lastContactDate.toDateString() : ''}</td>
              <td>{contact.nextContactDate ? contact.nextContactDate.toDateString() : ''}</td>
            </tr>
            <tr>
              <td colSpan="100%">{contact.notes}</td>
            </tr>
          </tbody>
        </Table>
        </div>
      );
    }
    else {
      return null;
    }
  }
}

export default ContactDetail;