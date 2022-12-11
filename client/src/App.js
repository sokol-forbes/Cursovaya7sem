import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Alert } from './components/Alert';
import { NavBar } from './components/NavBar';
import { useRoutes } from './routes';

function App() {
  const token = useSelector((state) => state.login.token);
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);
  const text = useSelector((state) => state.app.alert);

  return (
    <Router>
      {isAuthenticated && <NavBar /> }
      {text && <Alert text={text} /> }
      <div style={{
        overflowY: 'scroll',
        paddingBottom: '44px',
        height: 'calc(100% - 44px)',
      }} className="w-100 d-flex justify-content-center py-4 text-center vertical-center">
        {routes}
      </div>
      {/* <footer style={{
        color: 'white',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        textAlign: 'right',
        padding: '10px',
      }} className='bg-dark footer-dark'>
        powered by @Kirill
      </footer> */}
    </Router>
  );
}

export default App;
