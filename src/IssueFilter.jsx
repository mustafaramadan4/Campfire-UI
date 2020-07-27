import React from 'react';
import URLSearchParams from 'url-search-params';
import { withRouter } from 'react-router-dom';
import {
  ButtonToolbar, Button, FormGroup, FormControl, ControlLabel, InputGroup,
  Row, Col,
} from 'react-bootstrap';

class IssueFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    // TODO: add state variables for familiarity and frequency filters
    this.state = {
      activeStatus: params.get('activeStatus') || '',
      priority: params.get('priority') || '',
      // effortMin: params.get('effortMin') || '',
      // effortMax: params.get('effortMax') || '',
      changed: false,
    };
    // TODO: Bind functions for familiarity and frequency filters
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangePriority = this.onChangePriority.bind(this);
    // this.onChangeEffortMin = this.onChangeEffortMin.bind(this);
    // this.onChangeEffortMax = this.onChangeEffortMax.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeStatus(e) {
    console.log(e.target.value);
    this.setState({ activeStatus: e.target.value, changed: true });
  }

  onChangePriority(e) {
    this.setState({ priority: e.target.value, changed: true });
  }

  // TODO: Create onChange functions for familiarity and frequency filters

  onChangeEffortMin(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({ effortMin: e.target.value, changed: true });
    }
  }

  onChangeEffortMax(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({ effortMax: e.target.value, changed: true });
    }
  }


  showOriginalFilter() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      // TODO: reset state variables for familiarity and frequency filters
      activeStatus: params.get('activeStatus') || '',
      priority: params.get('priority') || '',
      // effortMin: params.get('effortMin') || '',
      // effortMax: params.get('effortMax') || '',
      changed: false,
    });
  }

  applyFilter() {
    // const { status, effortMin, effortMax } = this.state;
    const { activeStatus, priority } = this.state;
    const { history, urlBase } = this.props;
    const params = new URLSearchParams();
    if (activeStatus) params.set('activeStatus', activeStatus);
    if (priority) params.set('priority', priority);
    // TODO: Set params for familiarity and frequency filters
    // if (effortMin) params.set('effortMin', effortMin);
    // if (effortMax) params.set('effortMax', effortMax);

    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({ pathname: urlBase, search });
  }

  render() {
    const { activeStatus, priority, changed } = this.state;
    // const { effortMin, effortMax } = this.state;
    return (
      <Row>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Active Status:</ControlLabel>
            <FormControl
              componentClass="select"
              value={activeStatus}
              onChange={this.onChangeStatus}
            >
              <option value="">(All)</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
              {/* <option value="Fixed">Fixed</option>
              <option value="Closed">Closed</option> */}
            </FormControl>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Priority:</ControlLabel>
            <FormControl
              componentClass="select"
              value={priority}
              onChange={this.onChangePriority}
            >
              <option value="">(All)</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              {/* <option value="Fixed">Fixed</option>
              <option value="Closed">Closed</option> */}
            </FormControl>
          </FormGroup>
        </Col>
        {/* TODO: add Col/Form for familiarity and frequency filters */}
        {/* <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Effort between:</ControlLabel>
            <InputGroup>
              <FormControl value={effortMin} onChange={this.onChangeEffortMin} />
              <InputGroup.Addon>-</InputGroup.Addon>
              <FormControl value={effortMax} onChange={this.onChangeEffortMax} />
            </InputGroup>
          </FormGroup>
        </Col> */}
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>&nbsp;</ControlLabel>
            <ButtonToolbar>
              <Button bsStyle="primary" type="button" onClick={this.applyFilter}>
                Apply
              </Button>
              <Button
                type="button"
                onClick={this.showOriginalFilter}
                disabled={!changed}
              >
                Reset
              </Button>
            </ButtonToolbar>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}
export default withRouter(IssueFilter);
