import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import routes from './routes.js';

export default function Contents() {
  return (
    <Switch>
      {/* Changed redirect to "/dashboard" for now, maybe change to "/login" later*/}
      <Redirect exact from="/" to="/dashboard" />
      {routes.map(attrs => <Route {...attrs} key={attrs.path} />)}
    </Switch>
  );
}
