import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import routes from './routes.js';
import Welcome from  './Welcome.jsx';
import Dashboard from './Dashboard.jsx';
import IssueList from './IssueList.jsx';
import IssueReport from './IssueReport.jsx';
import IssueEdit from './IssueEdit.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';



export default function Contents({user}) {
  if (user.signedIn) {
    return (
      <Switch>
        {/* Signed In available routes */}
        <Redirect exact from="/" to="/welcome" />
        {routes.map(attrs => <Route {...attrs} key={attrs.path} />)}
      </Switch>
    );
  } else {
    return (
      <Switch>
          {/* Signed Out available routes */}
          <Redirect exact from="/" to="/welcome" />
          <Route path='/welcome' component={Welcome}/>
          <Redirect from="*" to="/welcome" />
      </Switch>
    );
  }
}
