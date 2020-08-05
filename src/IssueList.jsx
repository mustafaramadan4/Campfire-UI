import React from 'react';
import URLSearchParams from 'url-search-params';
import { Panel, Pagination, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import UserContext from './UserContext.js';

import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
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

class IssueList extends React.Component {
  static async fetchData(match, search, showError, user) {
    /* The React Router supplies as part of props, an object called "location"
    * that includes a query string (in the field "search"). The JavaScript API
    * "URLSearchParams()" parses the provided query string.
    */
    const params = new URLSearchParams(search);
    // this takes the user data to extract the email ans use it to "filter"
    const email = user.email;
    // const vars = { ownerEmail: email, hasSelection: false, selectedId: 0 };
    const vars = {ownerEmail: email, hasSelection: false, selectedId: 0 };
    // DONE: Implement vars for familiarity and frequency filters
    // params.get() method returns null if the parameter is not present,
    // so add a check before adding on to the vars defined above.
    if (params.get('activeStatus')) {
      vars.activeStatus = JSON.parse(params.get('activeStatus'));
    }
    if (params.get('priority')) vars.priority = params.get('priority');
    if (params.get('familiarity')) vars.familiarity = params.get('familiarity');
    if (params.get('contactFrequency')) vars.contactFrequency = params.get('contactFrequency');

    // const effortMin = parseInt(params.get('effortMin'), 10);
    // if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    // const effortMax = parseInt(params.get('effortMax'), 10);
    // if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;

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
    console.log("CONTACT LIST FROM CONSTRUCTOR: ", contacts);
    delete store.initialData;
    const _isMounted = false;
    console.log("CONTEXT FROM CONSTRUCTOR: ", this.context);
    const user = this.context;
    this.state = {
      contacts,
      selectedContact,
      pages,
      user,
    };
    // this.closeIssue = this.closeIssue.bind(this);
    this.toggleActiveStatus = this.toggleActiveStatus.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    const { contacts } = this.state;
    if (this._isMounted) {
      console.log("CALLING LOAD DATA FROM COMPONENT DID MOUNT");
      console.log("CONTACTS FROM DID MOUNT:", contacts);
      if (contacts == null) this.loadData();
    }
  }

  componentWillUnmount() {
    console.log("COMPONENT WILL UNMOUNT");
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    console.log("_Mounted: ", this._isMounted);
    if (this._isMounted) {
      console.log("STILL MOUNTED");
      const {user} = this.state;
      const newContext = this.context;
      // if(user !== newContext) {
      //   this.loadData();
      // }
      const {
        location: { search: prevSearch },
        match: { params: { id: prevId } },
      } = prevProps;
      const { location: { search }, match: { params: { id } } } = this.props;
      if (prevSearch !== search || prevId !== id || user !== newContext ) {
        console.log("CALLING LOAD DATA FROM COMPONENT DID UPDATE");
        console.log("FROM LOAD DATA OLD SEARCH: ", prevSearch);
        console.log("FROM LOAD DATA NEW SEARCH: ", search);
        console.log("FROM LOAD DATA OLD PREV ID: ", prevId);
        console.log("FROM LOAD DATA OLD NEW ID: ", id);
        console.log("FROM LOAD DATA OLD USER: ", user);
        console.log("FROM LOAD DATA NEW USER: ", newContext);
        this.loadData();
      }
    }
  }

  async loadData() {
    // Getting user data from the context and passing to FetchData function
    const user = this.context;
    console.log("CALLING FROM LOAD DATA" , user);
    const { location: { search }, match, showError } = this.props;
    const data = await IssueList.fetchData(match, search, showError, user);
    console.log("FETCHED DATA: ", data);
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

  // Implemented OFF status DONE: Implemented On/Off in the same button with success message
  // ^ agreed, toggle button may need some more work, as we may need to pass on props
  // to IssueTable to keep track of the activeStatus and call toggleActiveStatus or reactivateContact 
  // depending on the value of activeStatus
  /*{TODO: there is a weird behavior with the on/off button when clicking, this behavior
     disappears after clicking on any other part of the screen or closing the success message }*/
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
        console.log("CALLING LOAD DATA FROM TOGGLE SUCCESS");
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
      console.log("CALLING LOAD DATA FROM TOGGLE NO DATA");
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
    const { id } = contacts[index];
    const data = await graphQLFetch(query, { id }, showError);
    if (data && data.contactDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.contacts];
        if (pathname === `/issues/${id}`) {
          history.push({ pathname: '/issues', search });
        }
        newList.splice(index, 1);
        return { contacts: newList };
      });
      const undoMessage = (
        <span>
          {`Deleted contact ${id} successfully.`}
          <Button bsStyle="link" onClick={() => this.restoreContact(id)}>
            UNDO
          </Button>
        </span>
      );
      showSuccess(undoMessage);
    } else {
      console.log("CALLING LOAD DATA FROM DELETE CONTACT");
      this.loadData();
    }
  }

  // Implemented Restore Contact
  async restoreContact(id) {
    const query = `mutation contactRestore($id: Int!) {
      contactRestore(id: $id)
    }`;
    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { id }, showError);
    if (data) {
      showSuccess(`Contact ${id} restored successfully.`);
      console.log("CALLING LOAD DATA FROM RESTORE CONTACT");
      this.loadData();
    }
  }

  // changeContext(oldContext){
  //   console.log("CALLING FROM CHANGE CONTEXT OLD: ", oldContext);
  //   const newContext = this.context;
  //   console.log("CALLLING FROM CHANGE CONTEXT NEW: :", newContext);
  //   if(newContext !== oldContext) {
  //     this.loadData();
  //   }
  // }

  render() {
    // const {user} = this.state;
    const user = this.context;
    const disabled = !user.signedIn;

    // this.changeContext(user);

    // if(email !== null){
    //   this.loadData();
    // }

    const { contacts } = this.state;

    if (contacts == null || disabled) {
      return null;
    }

    // if (disabled) return null;

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
            <IssueFilter urlBase="/issues" />
          </Panel.Body>
        </Panel>
        <IssueTable
          contacts={contacts}
          toggleActiveStatus={this.toggleActiveStatus}
          deleteContact={this.deleteContact}
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

IssueList.contextType = UserContext;

const IssueListWithToast = withToast(IssueList);
IssueListWithToast.fetchData = IssueList.fetchData;

export default IssueListWithToast;
