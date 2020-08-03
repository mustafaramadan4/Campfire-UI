import React from 'react';
import URLSearchParams from 'url-search-params';
import { Panel, Pagination, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import IssueFilter from './IssueFilter.jsx';
// import IssueTable from './IssueTable.jsx';
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
    const vars = { hasSelection: false, selectedId: 0 };
    if (params.get('status')) vars.status = params.get('status');

    const effortMin = parseInt(params.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    const effortMax = parseInt(params.get('effortMax'), 10);
    if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;

    const { params: { id } } = match;
    const idInt = parseInt(id, 10);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    // const query = `query issueList(
    //   $status: StatusType
    //   $effortMin: Int
    //   $effortMax: Int
    //   $hasSelection: Boolean!
    //   $selectedId: Int!
    //   $page: Int
    // ) {
    //   issueList(
    //     status: $status
    //     effortMin: $effortMin
    //     effortMax: $effortMax
    //     page: $page
    //   ) {
    //     issues {
    //       id title status owner
    //       created effort due
    //     }
    //     pages
    //   }
    //   issue(id: $selectedId) @include (if : $hasSelection) {
    //     id description
    //   }
    // }`;

    const contactListQuery = `query contactList(
      $activeStatus: Boolean
      $page: Int
      $hasSelection: Boolean!
      $selectedId: Int!
      ) {
      contactList(page:$page, activeStatus: $activeStatus) {
        contacts {
          id name company title contactFrequency email
          phone LinkedIn priority familiarity contextSpace
          activeStatus}
        pages
      }
      contact(id: $selectedId) @include (if : $hasSelection) {
        id notes
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
    // this.closeIssue = this.closeIssue.bind(this);
    // this.deleteIssue = this.deleteIssue.bind(this);
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
        {/* <Panel>
          <Panel.Heading>
            <Panel.Title toggle>Filter</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <IssueFilter urlBase="/issues" />
          </Panel.Body>
        </Panel> */}
        <h1>
          Reconnect with these people next!
        </h1>
        <ReconnectTable
          issues={contacts}
          reconnectContact={this.reconnectContact}
          // deleteIssue={this.deleteIssue}
        />
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