import React from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Col, Panel, Form, FormGroup, FormControl, ControlLabel,
  ButtonToolbar, Button, Alert,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';
import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';
import withToast from './withToast.jsx';
import store from './store.js';
import UserContext from './UserContext.js';

class IssueEdit extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query contact($id: Int!) {
      contact(id: $id) {
        id name company title
        contactFrequency email phone LinkedIn
        priority familiarity contextSpace activeStatus
        lastContactDate nextContactDate notes
      }
    }`;

    const { params: { id } } = match;
    const result = await graphQLFetch(query, { id: parseInt(id, 10) }, showError);
    return result;
  }

  constructor() {
    super();
    const contact = store.initialData ? store.initialData.contact : null;
    delete store.initialData;
    this.state = {
      contact,
      invalidFields: {},
      showingValidation: false,
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);
    this.showValidation = this.showValidation.bind(this);
  }

  componentDidMount() {
    const { contact } = this.state;
    if (contact == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      contact: { ...prevState.contact, [name]: value },
    }));
  }

  onValidityChange(event, valid) {
    const { name } = event.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }


  async handleSubmit(e) {
    e.preventDefault();
    this.showValidation();
    const { contact, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;

    const query = `mutation contactUpdate(
      $id: Int!
      $changes: ContactUpdateInputs!
    ) {
      contactUpdate(
        id: $id
        changes: $changes
      ) {
        id name company title
        contactFrequency email phone LinkedIn
        priority familiarity contextSpace activeStatus
        lastContactDate nextContactDate notes
      }
    }`;

    const { id, ...changes } = contact;
    const { showSuccess, showError } = this.props;
    changes.activeStatus = JSON.parse(changes.activeStatus);
    /* TO DO: edit form has an error upon submit, `Variable $change got invalid value "true" at "changes.activationStatus",
    * expected type Boolean. $changes is passing on a string value of true,
    * which I think a parse function like we did line 29 can be used
    * FIXED WITH LINE 103
    */
    const data = await graphQLFetch(query, { changes, id }, showError);
    if (data) {
      this.setState({ contact: data.contactUpdate });
      showSuccess('Updated contact successfully');
    }
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await IssueEdit.fetchData(match, null, showError);

    this.setState({ contact: data ? data.contact : {}, invalidFields: {} });
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
  }

  render() {
    const { contact } = this.state;
    if (contact == null) return null;

    const { contact: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Contact with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }
    const { invalidFields, showingValidation } = this.state;
    let validationMessage;

    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
          Please correct invalid fields before submitting.
        </Alert>
      );
    }

    const { contact: { name, company, title, contactFrequency, email, phone, LinkedIn } } = this.state;
    const { contact: { priority, familiarity, contextSpace, activeStatus } } = this.state;
    const { contact: { lastContactDate, nextContactDate, notes } } = this.state;

    const user = this.context;

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Editing Contact: ${id}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Name</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="name"
                  value={name}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Company</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="company"
                  value={company}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Title</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="title"
                  value={title}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Contact Frequency</Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  name="contactFrequency"
                  value={contactFrequency}
                  onChange={this.onChange}
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Biweekly">BiWeekly</option>
                  <option value="Monthly">Monthly</option>
                  {/* why are the values all quartely below? */}
                  <option value="Quarterly">Quarterly</option>
                  <option value="Quarterly">Biannual</option>
                  <option value="Quarterly">Yearly</option>
                  <option value="Quarterly">None</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Email</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="email"
                  value={email}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Phone</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="phone"
                  value={phone}
                  onChange={this.onChange}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>LinkedIn</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="LinkedIn"
                  value={LinkedIn}
                  onChange={this.onChange}
                />
              </Col>
            </FormGroup>
            {/* TO DO: ADD OTHER CONTACT INFO FIELD?? */}
            {/* <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Other Contact Info</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="Other"
                  value={otherContactInfo}
                  onChange={this.onChange}
                />
              </Col>
            </FormGroup> */}
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Priority</Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  name="priority"
                  value={priority}
                  onChange={this.onChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Familiarity</Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  name="familiarity"
                  value={familiarity}
                  onChange={this.onChange}
                >
                  <option value="familiar">Familiar</option>
                  <option value="unfamiliar">Unfamiliar</option>
                  <option value="intimate">Intimate</option>
                  <option value="meaningful">Meaningful</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Context Space</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="contextSpace"
                  value={contextSpace}
                  onChange={this.onChange}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Active Contact</Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  name="activeStatus"
                  value={activeStatus}
                  onChange={this.onChange}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Last Contact Date</Col>
              <Col sm={9}>
                <FormControl.Static>
                  {lastContactDate.toDateString()}
                </FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup validationState={
              invalidFields.due ? 'error' : null
            }
            >
              <Col componentClass={ControlLabel} sm={3}>Next Contact Date</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={DateInput}
                  onValidityChange={this.onValidityChange}
                  name="nextContactDate"
                  value={nextContactDate}
                  onChange={this.onChange}
                  key={id}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Notes</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  tag="textarea"
                  rows={4}
                  cols={50}
                  name="notes"
                  value={notes}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button
                    disabled={!user.signedIn}
                    bsStyle="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                  <LinkContainer to="/issues">
                    <Button bsStyle="link">Back</Button>
                  </LinkContainer>
                </ButtonToolbar>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={9}>{validationMessage}</Col>
            </FormGroup>
          </Form>
        </Panel.Body>
        <Panel.Footer>
          <Link to={`/edit/${id - 1}`}>Prev</Link>
          {' | '}
          <Link to={`/edit/${id + 1}`}>Next</Link>
        </Panel.Footer>
      </Panel>
    );
  }
}

IssueEdit.contextType = UserContext;

const IssueEditWithToast = withToast(IssueEdit);
IssueEditWithToast.fetchData = IssueEdit.fetchData;

export default IssueEditWithToast;
