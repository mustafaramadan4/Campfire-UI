import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import routes from './routes.js';

export default function Contents({user}) {
  return (
    <Switch>
      {/* Changed redirect to "/dashboard" for now, maybe change to "/login" later*/}
      <Redirect exact from="/" to="/welcome" />
      {routes.map(attrs => <Route {...attrs} key={attrs.path} />)}
    </Switch>
  );
}
