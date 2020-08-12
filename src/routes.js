import Welcome from  './Welcome.jsx';
import Dashboard from './Dashboard.jsx';
import IssueList from './IssueList.jsx';
import ContactEdit from './ContactEdit.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';

const routes = [
  { path: '/welcome', component: Welcome },
  { path: '/contacts/:id?', component: IssueList },
  { path: '/dashboard/:id?', component: Dashboard },
  { path: '/edit/:id', component: ContactEdit },
  // { path: '/report', component: IssueReport },
  { path: '/about', component: About },
  { path: '*', component: NotFound },
];

export default routes;
