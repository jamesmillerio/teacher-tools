import React from 'react';
import { Route, Switch } from 'react-router';

import Home from '../home';
import PacePlanner from '../tools/paceplanner';

const ToolsRouter = () => (
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="/pace">
      <PacePlanner />
    </Route>
  </Switch>
);

export default ToolsRouter;
