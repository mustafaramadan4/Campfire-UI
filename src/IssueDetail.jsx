// import React from 'react';

// export default function IssueDetail({ contact }) {
//   if (contact) {
//     return (
//       <div>
//         <h3>Description</h3>
//         <pre>{contact.notes}</pre>
//       </div>
//     );
//   }
//   return null;
// }

import React from 'react';
import { Table } from 'react-bootstrap';

/*
* TODO: 
* 1. On browser refresh, it only renders the notes but not the other fields.
* I mean if it doesn't render if shouldn't render altogether and if it renders it should render everything. what's going on?
* 2. When you activate/deactivate the contact in the IssueTable, it doesn't render again with updated dates.
* expected becaue we're not capturing any changes.
* You can click on some other contact and come back to it to view the update dates,
* but we probably need something to keep track of the toggle changes to rerender the contact detail as well.
* was this an onchange method? lifecycle methods?
*/

class IssueDetail extends React.Component {
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
    console.log("hello", result)
    return result;
  }

  // constructor(props) {
  //   super(props);
  //   this.state = { contact: this.props}
  // }

  // constructor() {
  //   super();
    
  // }


  componentDidUpdate(prevProps) {
    if (this.props.nextContactDate !== prevProps.nextContactDate) {
      this.loadData();
    }
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await IssueDetail.fetchData(match, null, showError);
    console.log(data)
    this.setState({ contact: data ? contact.issue : {}});
  }

  // componentDidMount() {
  //   const { contacts } = this.state;
  //   if (contacts == null) this.render();
  // }

  // const { contact: { name, phone } } = this.state;
  // const { contact: { LinkedIn, contextSpace, notes } } = this.state;
  // const { contact: { lastContactDate, nextContactDate } } = this.state;

  render() {
    const { contact } = this.props;
    if (contact) {
      return (
        <div>
        <h3>Contact Details</h3>
        <Table condensed responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Linkedin</th>
              <th>Context</th>
              <th>Last contacted</th>
              <th>Next contact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{contact.name}</td>
              <td>{contact.phone}</td>
              <td>{contact.LinkedIn}</td>
              <td>{contact.contextSpace}</td>
              <td>{contact.lastContactDate ? contact.lastContactDate.toDateString() : ''}</td>
              <td>{contact.nextContactDate ? contact.nextContactDate.toDateString() : ''}</td>
            </tr>
            <tr>
              <td colSpan="100%">{contact.notes}</td>
            </tr>
          </tbody>
        </Table>
        </div>
      );
    }
    else {
      return null;
    }
  }
}

export default IssueDetail;