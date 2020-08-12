import Welcome from  './Welcome.jsx';
import Dashboard from './Dashboard.jsx';
import ContactList from './ContactList.jsx';
import ContactEdit from './ContactEdit.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';

const routes = [
  { path: '/welcome', component: Welcome },
  { path: '/contacts/:id?', component: ContactList },
  { path: '/dashboard/:id?', component: Dashboard },
  { path: '/edit/:id', component: ContactEdit },
  { path: '/about', component: About },
  { path: '*', component: NotFound },
];

export default routes;
