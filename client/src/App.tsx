import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" render={() => (
          isAuthenticated ? (
            isAdmin ? <Redirect to="/admin" /> : <Redirect to="/dashboard" />
          ) : (
            <Redirect to="/login" />
          )
        )} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" render={() => (
          isAuthenticated ? <UserDashboard /> : <Redirect to="/login" />
        )} />
        <Route path="/admin" render={() => (
          isAuthenticated && isAdmin ? <AdminDashboard /> : <Redirect to="/" />
        )} />
      </Switch>
    </Router>
  );
};

export default App;
