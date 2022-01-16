import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Ventas from './pages/Ventas';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import CRMProducts from './pages/CRMProducts';


const RouterPath = (props) => {

return (
    <Router>
      <Switch>

        {/* <Route path='/admin' exact={true} component={Admin} /> */}
        <Route path='/' exact={true} component={Login} />
        <Route path='/ventas' exact={true} component={Ventas} />
        <Route path='/inicio' exact={true} component={Inicio} />
        <Route path='/productos' exact={true} component={CRMProducts} />


      </Switch>
    </Router>
  )
}

export default RouterPath;