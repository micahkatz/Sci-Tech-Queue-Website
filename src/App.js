import React from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import Home from './pages/Home';
import Login from './pages/Login';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { GLOBALS } from './globals';
Amplify.configure(awsconfig);
function App() {
    return (
        <Router>
            <div className='App'>
                <div
                    style={{
                        width: '100vw',
                        height: '10px',
                        backgroundColor: GLOBALS.orange,
                        position: 'absolute',
                    }}
                />
                <Route path={'/home'} component={Home} />
                <Route path={'/admin'} component={Login} />
            </div>
        </Router>
    );
}

export default App;
