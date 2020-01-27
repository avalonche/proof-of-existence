import React from 'react';
import { Router, Switch, Route, Redirect } from '../utils/Router';

import { Home, Verify, Content, Account, NotFound } from '../layout';
import Layout from '../components/Layout';
import ContentLoader from '../components/ContentLoader';

const Navigation = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" render={() => (
            <Redirect to="/home"/>
          )}/>
          <Route exact path="/home" render={(props) => (
            <ContentLoader>
              <Home {...props}/>
            </ContentLoader>
          )}/>
          <Route exact path="/verify" component={Verify}/>
          <Route exact path="/content/:id" component={Content}/>
          <Route exact path="/account" component={Account}/>
          <Route exact path="*" component={NotFound}/>
        </Switch>
      </Layout>
    </Router>
  );
}

export default Navigation;
