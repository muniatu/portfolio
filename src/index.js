import React from 'react';
import ReactDOM from 'react-dom';
import Solojuegos from './pages/Solojuegos'
import Filehippo from './pages/Filehippo'
import Tokoro from './pages/Tokoro'
import Flapimas from './pages/Flapimas'
import Menu from './pages/Menu'
import './index.scss';
import 'lato-font';
    
import {
      BrowserRouter as Router,
      Switch,
      Route,
    } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
            <Menu />
        </Route>
        <Route path="/solojuegos">
          <Solojuegos />
        </Route>
        <Route path="/filehippo">
          <Filehippo />
        </Route>
        <Route path="/tokoro">
          <Tokoro />
        </Route>
        <Route path="/flapimas">
          <Flapimas />
        </Route>
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
