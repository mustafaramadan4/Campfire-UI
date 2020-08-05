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

  const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props)=> (
      (user.signedIn) === true 
        ? <Component {...props}/>
        : <Redirect to='/welcome'/>
    )} />
  )

  return (
    <Switch>
        <Redirect exact from="/" to="/welcome" />
        <Route path='/welcome' component={Welcome}/>
        <PrivateRoute path='/dashboard' component={Dashboard}/>
        <PrivateRoute path='/issues/:id?' component={IssueList}/>
        <PrivateRoute path='/edit/:id' component={IssueEdit}/>
        <PrivateRoute path='/report' component={IssueReport}/>
        <Route path='/about' component={About}/>
        <Route path='/*' component={About}/>
    </Switch>
  );


  // console.log("Contesnts user signedin status:", user.signedIn)
  // if (user.signedIn) {
  //   return (
  //     <Switch>
  //       {/* Signed In available routes */}
  //       <Redirect exact from="/" to="/welcome" />
  //       {routes[0].map(attrs => <Route {...attrs} key={attrs.path} />)}
  //     </Switch>
  //   );
  // } else {
  //   return (
  //     <Switch>
  //       {/* Not Signed In available routes */}
  //       <Redirect exact from="/" to="/welcome" />
  //       {routes[1].map(attrs => <Route {...attrs} key={attrs.path} />)}
  //     </Switch>
  //   );
  // };
}
