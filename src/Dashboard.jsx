import React from 'react';
import URLSearchParams from 'url-search-params';
import { Panel, Pagination, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import DateFilter from './DateFilter.jsx';
import ReconnectTable from './ReconnectTable.jsx';
import IssueDetail from './IssueDetail.jsx';
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
  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    //SHH
    // const vars = { hasSelection: false, selectedId: 0 };
    // Upcoming date less than or equal to today
    const vars = { nextContactDate: new Date(), daysAhead: 3 };
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
    console.log("vars is: " + JSON.stringify(vars));

    const { params: { id } } = match;
    const idInt = parseInt(id, 10);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    // SHHH: added nextcontacDate
    const contactListQuery = `query contactList(
      $page: Int
      $nextContactDate: GraphQLDate
      $daysAhead: Int
      ) {
      contactList(page: $page, nextContactDate: $nextContactDate, daysAhead: $daysAhead) {
        contacts {
          id name company title contactFrequency email
          phone LinkedIn priority familiarity contextSpace
          activeStatus lastContactDate nextContactDate notes }
        pages
      }
    }`;

    // modified to contact list query
    const data = await graphQLFetch(contactListQuery, vars, showError);
    return data;
  }

  constructor() {
    super();
    const initialData = store.initialData || { contactList: {} };
    const {
      contactList: { contacts, pages }, contact: selectedContact,
    } = initialData;
    delete store.initialData;
    this.state = {
      contacts,
      selectedContact,
      pages,
    };
    this.reconnectContact = this.reconnectContact.bind(this);
  }

  componentDidMount() {
    const { contacts } = this.state;
    if (contacts == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
      match: { params: { id: prevId } },
    } = prevProps;
    const { location: { search }, match: { params: { id } } } = this.props;
    if (prevSearch !== search || prevId !== id) {
      this.loadData();
    }
  }

  async loadData() {
    // TODO: loadData doesn't define data.contact so that we can set it to selectedContact,
    // so it's just returing undefined causing the IssueDetail not to render.
    // Currently trying to figure out if the hasSelection and selectedId is working as it should.
    const { location: { search }, match, showError } = this.props;
    const data = await Dashboard.fetchData(match, search, showError);
    if (data) {
      this.setState({
        // changed to contactList query and contacts
        contacts: data.contactList.contacts,
        // Load notes if selecting the Contact
        selectedContact: data.contact,
        // changed to contactList query and contacts
        pages: data.contactList.pages,
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
    if (contacts == null) return null;

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
        {/* TO DO: DECIDE IF WE WILL HAVE FILTER ON DASHBOARD */}
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>Filter</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <DateFilter urlBase="/dashboard" />
          </Panel.Body>
        </Panel>
        <h1>
          Reconnect with these people next!
        </h1>
        <ReconnectTable
          issues={contacts}
          reconnectContact={this.reconnectContact}
          daysAhead={7}
        />
        {/* <h2>More Upcoming contacts...</h2>
        <ReconnectTable
          issues={contacts}
          reconnectContact={this.reconnectContact}
          daysAhead={15}
        /> */}
        <IssueDetail contact={selectedContact} />
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

const DashListWithToast = withToast(Dashboard);
DashListWithToast.fetchData = Dashboard.fetchData;

export default DashListWithToast;