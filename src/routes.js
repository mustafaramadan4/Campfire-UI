import Welcome from  './Welcome.jsx';
import Dashboard from './Dashboard.jsx';
import IssueList from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';

const routes = [
  { path: '/welcome', component: Welcome },
  { path: '/issues/:id?', component: IssueList },
  { path: '/dashboard/:id?', component: Dashboard },
  { path: '/edit/:id', component: IssueEdit },
  // { path: '/report', component: IssueReport },
  { path: '/about', component: About },
  { path: '*', component: NotFound },
];

export default routes;
