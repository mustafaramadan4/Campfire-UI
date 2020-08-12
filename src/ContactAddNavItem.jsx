import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  NavItem, Glyphicon, Modal, Form, FormGroup, FormControl, ControlLabel,
  Button, ButtonToolbar, Tooltip, OverlayTrigger,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';
import PhoneInput, {
  formatPhoneNumber, formatPhoneNumberIntl, isValidPhoneNumber, isPossiblePhoneNumber
} from 'react-phone-number-input';

class ContactAddNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      invalidFields: {},
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.hideModal();
    const form = document.forms.contactAdd;
    const contact = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      LinkedIn: form.LinkedIn.value,
      lastContactDate: new Date(),
      ownerEmail: this.props.user.email,
    };
    /* DONE: the add form handles submit, the query string has been updated with the mutation api call to contactAdd. 
    */

   const query = `mutation contactAdd($contact: ContactInputs!) {
    contactAdd(contact: $contact) {
      id name email phone LinkedIn lastContactDate
    }
  }`;

    const { showError } = this.props;
    const data = await graphQLFetch(query, { contact }, showError);
    form.name.value = ''; form.email.value = ''; form.phone.value = ''; form.LinkedIn.value = '';
    // updated graphQL var pass from issue to contact
    if (data) {
      const { history } = this.props;
      history.push(`/edit/${data.contactAdd.id}`);
    }
  }

  onPhoneChange(new_phone) {
    let valid = true;
    const value = new_phone === undefined ? '' : new_phone;
    if(value !== ''){
      valid = isValidPhoneNumber(value);
    }
    const { invalidFields } = this.state;
    
    if(!valid) {
      this.setState((prevState) => {
        const invalidFields = { ...prevState.invalidFields, ["phone"]: !valid };
        return { invalidFields };
      });
    } else{
      // delete invalidFields["phone"];
      // const form = document.forms.contactAdd;
      // form.phone.value = value;
      this.setState({
        invalidFields: {}
      });
    }
  }

  render() {
    const { showing, invalidFields } = this.state;
    const { user: { signedIn } } = this.props;
    return (
      <React.Fragment>
        <NavItem disabled={!signedIn} onClick={this.showModal}>
          <OverlayTrigger
            placement="left"
            delayShow={1000}
            overlay={<Tooltip id="create-contact">Add Contact</Tooltip>}
          >
            <Glyphicon glyph="plus" />
          </OverlayTrigger>
        </NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Contact (min. 1 contact information field required)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="contactAdd">
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl name="name" autoFocus />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Email*</ControlLabel>
                <FormControl name="email" />
              </FormGroup>
              <FormGroup validationState={invalidFields.phone ? 'error' : null}>
                <ControlLabel>Phone Number*</ControlLabel>
                <FormControl
                componentClass={PhoneInput}
                international
                defaultCountry="US"
                name="phone"
                // value={phone}
                onChange={this.onPhoneChange}
                />
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup>
                <ControlLabel>LinkedIn*</ControlLabel>
                <FormControl name="LinkedIn" />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button
                type="button"
                bsStyle="primary"
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
              <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withToast(withRouter(ContactAddNavItem));
