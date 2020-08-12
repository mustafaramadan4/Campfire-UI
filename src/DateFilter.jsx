import React from 'react';
import URLSearchParams from 'url-search-params';
import { withRouter } from 'react-router-dom';
import {
  ButtonToolbar, Button, FormGroup, FormControl, ControlLabel,
  Row, Col,
} from 'react-bootstrap';

class DateFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      dateRange: params.get('dateRange') || '',
      changed: false,
    };
    this.onChangeDateRange = this.onChangeDateRange.bind(this);
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

  onChangeDateRange(event) {
    this.setState({ dateRange: event.target.value, changed: true });
  }

  showOriginalFilter() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      dateRange: params.get('dateRange') || '',
      changed: false,
    });
  }

  applyFilter() {
    const { dateRange } = this.state;
    const { history, urlBase } = this.props;
    const params = new URLSearchParams();
    // this allows for a capture of an drop down menu select event,
    // and set the URL param to e.g. dashboard?dateRange=thisWeek
    if (dateRange) {
      params.set('dateRange', dateRange);
    } 

    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({ pathname: urlBase, search });
  }

  render() {
    const { dateRange, changed } = this.state;
    return (
      <Row>
        <Col xs={6} sm={4} md={3} lg={3}>
          <FormGroup>
            <ControlLabel>Date Range:</ControlLabel>
            <FormControl
              componentClass="select"
              value={dateRange}
              onChange={this.onChangeDateRange}
            >
              <option value="">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="twoWeek">2 Weeks</option>
              <option value="fourWeek">30 days</option>
            </FormControl>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={3}>
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
export default withRouter(DateFilter);
