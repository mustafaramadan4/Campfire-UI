import React from 'react';
import URLSearchParams from 'url-search-params';
import { Panel, Pagination, Button, Jumbotron } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import UserContext from './UserContext.js';

import DateFilter from './DateFilter.jsx';
import ReconnectTable from './ReconnectTable.jsx';
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

class Dashboard extends React.Component {
  static async fetchData(match, search, showError, user) {
    const params = new URLSearchParams(search);
    const email = user.email;
    // Upcoming date less than or equal to today
    const vars = {
      hasSelection: false, 
      selectedId: 0,
      nextContactDate: new Date(),
      daysAhead: 1,
      ownerEmail: email
    };
    // set the "default" daysAhead as whatever we define above,
    // which will be the case when there's no dateRange params passed on,
    // and change the value if there's urlParams defined by applying the filter
    // in applyFilter() in DateFilter.jsx
    if (params.get('dateRange')) {
      const dateRange = params.get('dateRange');
      if (dateRange === "thisWeek") {
        vars.daysAhead = 7;
      } else if (dateRange === "twoWeek") {
        vars.daysAhead = 14;
      } else if (dateRange === "fourWeek") {
        vars.daysAhead = 30;
      }
    }

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
      $page: Int
      $nextContactDate: GraphQLDate
      $daysAhead: Int
      $ownerEmail: String
      $hasSelection: Boolean!
      $selectedId: Int!
      ) {
      contactList(
        page: $page
        nextContactDate: $nextContactDate
        daysAhead: $daysAhead
        ownerEmail: $ownerEmail
        ) {
        contacts {
          id name company title contactFrequency email
          phone LinkedIn priority familiarity contextSpace
          activeStatus lastContactDate nextContactDate notes }
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
    const user = this.context;
    this.state = {
      contacts,
      selectedContact,
      pages,
      user,
    };
    this.reconnectContact = this.reconnectContact.bind(this);
  }

  componentDidMount() {
    const { contacts } = this.state;
    if (contacts == null) this.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    const {user} = prevState;
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

  async loadData() {
    const { location: { search }, match, showError } = this.props;
    const user= this.context;
    const data = await Dashboard.fetchData(match, search, showError, user);
    if (data) {
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

  async reconnectContact(index) {
    const query = `mutation contactReconnect($id: Int!) {
      contactUpdate( id: $id, changes: {lastContactDate: "${new Date().toISOString()}"}) {
        id name company title
        contactFrequency email phone LinkedIn
        priority familiarity contextSpace activeStatus
        lastContactDate nextContactDate notes
      }
    }`;
    const {contacts} = this.state;
    const { showError } = this.props;
    const data = await graphQLFetch(query, {id: contacts[index].id}, showError);
    if (data) {
      this.setState((prevState) => {
        const newList = [...prevState.contacts];
        newList[index] = data.contactUpdate;
        return { contacts: newList };
      });
    } else {
      this.loadData();
    }
  }

  render() {
    const { contacts } = this.state;
    const user = this.context;
    const disabled = !user.signedIn;
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
          <Panel.Body>
            <DateFilter urlBase="/dashboard" />
          </Panel.Body>
        </Panel>
        <Jumbotron>
          <h2>Reconnect with these people next!</h2>
        </Jumbotron>
        <ReconnectTable
          contacts={contacts}
          reconnectContact={this.reconnectContact}
          daysAhead={7}
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

Dashboard.contextType = UserContext;
const DashListWithToast = withToast(Dashboard, UserContext);
DashListWithToast.fetchData = Dashboard.fetchData;

export default DashListWithToast;