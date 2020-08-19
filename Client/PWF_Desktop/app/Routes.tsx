/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import Home from './components/Home';
import Feed from './components/Feed/Feed';
import Ranking from './components/Ranking/Ranking';
import Navbar from './components/Navbar/Navbar';
import Settings from './components/Settings/Settings';
import GlobalStyles from './constants/styles.json';
import { RouterSharp } from '@material-ui/icons';

// Lazily load routes and code split with webpacck
// const LazyCounterPage = React.lazy(() =>
//   import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
// );

// const CounterPage = (props: Record<string, any>) => (
//   <React.Suspense fallback={<h1>Loading...</h1>}>
//     <LazyCounterPage {...props} />
//   </React.Suspense>
// );

export default function Routes() {
  return (
    <App>
      <div style={{ paddingBottom: GlobalStyles.footerHeight }}>
        <Navbar />
        <main style={{ paddingLeft: GlobalStyles.navWidth }}>
          <Switch>
            <Route exact path={routes.HOME}>
              <Home />
            </Route>
            <Route exact path={routes.RANKING}>
              <Ranking />
            </Route>
            <Route exact path={routes.SETTINGS}>
              <Settings />
            </Route>
          </Switch>
        </main>
      </div>
      <Feed />
    </App>
  );
}
