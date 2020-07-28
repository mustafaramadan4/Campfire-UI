import React from 'react';

export default function IssueDetail({ issue }) {
  if (issue) {
    return (
      <div>
        <h3>Description</h3>
        <pre>{issue.notes}</pre>
      </div>
    );
  }
  return null;
}

// import React from 'react';
// import { Table } from 'react-bootstrap';

/*
* TODO: 
* 1. Why is phone ~ active status not showing data..? console.log prints undefined hmm..
* 2. When you activate/deactivate the contact in the IssueTable, it doesn't render again with updated dates.
* You can click on some other contact and come back to it to view the update dates,
* but we probably need something to keep track of the toggle status change to rerender the contact detail as well.
* was this an onchange method as props?
* 3. wait now it doesn't even recognize contact..? what??? commenting out for now.
*/

// class IssueDetail extends React.Component {
//   render() {
//     const { contact } = this.props;
//     if (contact) {
//       return (
//         <div>
//         <Table condensed responsive>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Phone</th>
//               <th>Linkedin</th>
//               <th>Context</th>
//               <th>Active Status</th>
//               <th>Last contacted</th>
//               <th>Next contact</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>{contact.name}</td>
//               <td>{contact.phone}</td>
//               <td>{contact.LinkedIn}</td>
//               <td>{contact.contextSpace}</td>
//               {console.log(contact.contextSpace)}
//               <td>{contact.activeStatus}</td>
//               <td>{contact.lastContactDate ? contact.lastContactDate.toDateString() : 'N/A'}</td>
//               <td>{contact.nextContactDate ? contact.nextContactDate.toDateString() : 'N/A'}</td>
//             </tr>
//             <tr>
//               <td colSpan="100%">{contact.notes}</td>
//             </tr>
//           </tbody>
//         </Table>
//         </div>
//       );
//     }
//     else {
//       return "there's an issue";
//     }
//   }
// }

// export default IssueDetail;