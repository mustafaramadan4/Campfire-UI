import React from 'react';
import SelectAsync from 'react-select/lib/Async'; // eslint-disable-line
import { withRouter } from 'react-router-dom';
import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeSelection = this.onChangeSelection.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }

  onChangeSelection({ value }) {
    const { history } = this.props;
    history.push(`/edit/${value}`);
  }

  async loadOptions(term) {
    if (term.length < 3) return [];
    const query = `query contactList($search: String $ownerEmail: String) {
      contactList(search: $search ownerEmail: $ownerEmail) {
        contacts {id name company title}
      }
    }`;
    // Get user email for search query
    const {user} = this.props;
    const { showError } = this.props;
    const data = await graphQLFetch(query, { search: term, ownerEmail: user.email}, showError);
    return data.contactList.contacts.map(contact => ({
      label: `#${contact.id}: ${contact.name}`, value: contact.id,
    }));
  }

  render() {
    return (
      <SelectAsync
        instanceId="search-select"
        value=""
        loadOptions={this.loadOptions}
        filterOption={() => true}
        onChange={this.onChangeSelection}
        components={{ DropdownIndicator: null }}
      />
    );
  }
}

export default withRouter(withToast(Search));
