import React from 'react';
import URLSearchParams from 'url-search-params';
import { Panel, Pagination, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import UserContext from './UserContext.js';

import ContactFilter from './ContactFilter.jsx';
import ContactTable from './ContactTable.jsx';
import ContactDetail from './ContactDetail.jsx';
import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';
import store from './store.js';

const SECTION_SIZE = 5;

function PageLink({
  params, page, activePage, children,
}) {
  params.set('page', page);
  if (page === 0) return React.cloneElement(children, { disabled: true });
  return (
    <LinkContainer
      isActive={() => page === activePage}
      to={{ search: `?${params.toString()}` }}
    >
      {children}
    </LinkContainer>
  );
}

class ContactList extends React.Component {
  static async fetchData(match, search, showError, user) {
    /* The React Router supplies as part of props, an object called "location"
    * that includes a query string (in the field "search"). The JavaScript API
    * "URLSearchParams()" parses the provided query string.
    */
    const params = new URLSearchParams(search);
    // this takes the user data to extract the email ans use it to "filter"
    const email = user.email;
    const vars = {ownerEmail: email, hasSelection: false, selectedId: 0 };
    if (params.get('activeStatus')) {
      vars.activeStatus = JSON.parse(params.get('activeStatus'));
    }
    if (params.get('priority')) vars.priority = params.get('priority');
    if (params.get('familiarity')) vars.familiarity = params.get('familiarity');
    if (params.get('contactFrequency')) vars.contactFrequency = params.get('contactFrequency');

    const { params: { id } } = match;
    const idInt = parseInt(id, 10);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    const contactListQuery = `query contactList(
      $ownerEmail: String
      $contactFrequency: frequency
      $priority: priority
      $familiarity: familiarity
      $activeStatus: Boolean
      $page: Int
      $hasSelection: Boolean!
      $selectedId: Int!
      ) {
      contactList(
        ownerEmail: $ownerEmail
        activeStatus: $activeStatus
        familiarity: $familiarity
        priority: $priority
        contactFrequency: $contactFrequency
        page: $page
        ) {
        contacts {
          id name company title contactFrequency email
          phone LinkedIn priority familiarity contextSpace
          activeStatus}
        pages
      }
      contact(id: $selectedId) @include (if : $hasSelection) {
        id name LinkedIn phone contextSpace activeStatus lastContactDate nextContactDate notes
      }
    }`;

    // modified to contact list query
    const data = await graphQLFetch(contactListQuery, vars, showError);
    return data;
  }

  constructor(props) {
    super(props);
    const initialData = store.initialData || { contactList: {} };
    const {
      contactList: { contacts, pages }, contact: selectedContact,
    } = initialData;
    delete store.initialData;
    const _isMounted = false;
    const user = this.context;
    this.state = {
      contacts,
      selectedContact,
      pages,
      user,
    };
    this.toggleActiveStatus = this.toggleActiveStatus.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    const { contacts } = this.state;
    if (this._isMounted) {
      if (contacts == null) this.loadData();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (this._isMounted) {
      const {user} = this.state;
      const newContext = this.context;
      const {
        location: { search: prevSearch },
        match: { params: { id: prevId } },
      } = prevProps;
      const { location: { search }, match: { params: { id } } } = this.props;
      if (prevSearch !== search || prevId !== id || user !== newContext ) {
        this.loadData();
      }
    }
  }

  async loadData() {
    // Getting user data from the context and passing to FetchData function
    const user = this.context;
    const { location: { search }, match, showError } = this.props;
    const data = await ContactList.fetchData(match, search, showError, user);
    if (this._isMounted && data) {
      this.setState({
        // changed to contactList query and contacts
        contacts: data.contactList.contacts,
        // Load notes if selecting the Contact
        selectedContact: data.contact,
        // changed to contactList query and contacts
        pages: data.contactList.pages,
        user: user,
      });
    }
  }

  async toggleActiveStatus(index) {
    const { showSuccess, showError } = this.props;
    const { contacts } = this.state;
    let query;
    let action;
    if (contacts[index].activeStatus) {
      query = `mutation toggleActiveStatus($id: Int!) {
        contactUpdate(id: $id,
          changes: { activeStatus: false nextContactDate: null }) {
          id name company title
          contactFrequency email phone LinkedIn
          priority familiarity contextSpace activeStatus
          lastContactDate nextContactDate notes
        }
      }`;
      action = "Deactivated";
    } else {
      query = `mutation toggleActiveStatus($id: Int!) {
        contactUpdate(id: $id, changes: { activeStatus: true nextContactDate: null }) {
          id name company title
          contactFrequency email phone LinkedIn
          priority familiarity contextSpace activeStatus
          lastContactDate nextContactDate notes
        }
      }`;
      action = "Activated";
    }
    const data = await graphQLFetch(query, { id: contacts[index].id },
      showError);
    if (data) {
      this.setState((prevState) => {
        const newList = [...prevState.contacts];
        newList[index] = data.contactUpdate;
        this.loadData()
        return { contacts: newList };
      });
      const actionMessage = (
        <span>
          {`${action} contact ${contacts[index].name} successfully.`}
        </span>
      );
      showSuccess(actionMessage);
    } else {
      this.loadData();
    }
  }

  // Implemented Delete Contact
  async deleteContact(index) {
    const query = `mutation contactDelete($id: Int!) {
      contactDelete(id: $id)
    }`;
    const { contacts } = this.state;
    const { location: { pathname, search }, history } = this.props;
    const { showSuccess, showError } = this.props;
    const { id, name } = contacts[index];
    const data = await graphQLFetch(query, { id }, showError);
    if (data && data.contactDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.contacts];
        if (pathname === `/contacts/${id}`) {
          history.push({ pathname: '/contacts', search });
        }
        newList.splice(index, 1);
        return { contacts: newList };
      });
      const undoMessage = (
        <span>
          {`Deleted contact ${name} successfully.`}
          <Button bsStyle="link" onClick={() => this.restoreContact(id, name)}>
            UNDO
          </Button>
        </span>
      );
      showSuccess(undoMessage);
    } else {
      this.loadData();
    }
  }

  // Implemented Restore Contact
  async restoreContact(id, name) {
    const query = `mutation contactRestore($id: Int!) {
      contactRestore(id: $id)
    }`;
    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { id }, showError);
    if (data) {
      showSuccess(`Contact ${name} restored successfully.`);
      this.loadData();
    }
  }

  render() {
    const user = this.context;
    const disabled = !user.signedIn;
    const { contacts } = this.state;

    if (contacts == null || disabled) {
      return null;
    }

    const { selectedContact, pages } = this.state;
    const { location: { search } } = this.props;

    const params = new URLSearchParams(search);
    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    const startPage = Math.floor((page - 1) / SECTION_SIZE) * SECTION_SIZE + 1;
    const endPage = startPage + SECTION_SIZE - 1;
    const prevSection = startPage === 1 ? 0 : startPage - SECTION_SIZE;
    const nextSection = endPage >= pages ? 0 : startPage + SECTION_SIZE;

    const items = [];
    for (let i = startPage; i <= Math.min(endPage, pages); i += 1) {
      params.set('page', i);
      items.push((
        <PageLink key={i} params={params} activePage={page} page={i}>
          <Pagination.Item>{i}</Pagination.Item>
        </PageLink>
      ));
    }

    return (
      <React.Fragment>
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>Filter</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <ContactFilter urlBase="/contacts" />
          </Panel.Body>
        </Panel>
        <ContactTable
          contacts={contacts}
          toggleActiveStatus={this.toggleActiveStatus}
          deleteContact={this.deleteContact}
        />
        <ContactDetail contact={selectedContact} />
        <Pagination>
          <PageLink params={params} page={prevSection}>
            <Pagination.Item>{'<'}</Pagination.Item>
          </PageLink>
          {items}
          <PageLink params={params} page={nextSection}>
            <Pagination.Item>{'>'}</Pagination.Item>
          </PageLink>
        </Pagination>
      </React.Fragment>
    );
  }
}

ContactList.contextType = UserContext;

const ContactListWithToast = withToast(ContactList);
ContactListWithToast.fetchData = ContactList.fetchData;

export default ContactListWithToast;