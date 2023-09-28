import React from 'react';
import { LogBox } from 'react-native';
import Router from './navigation';
LogBox.ignoreAllLogs(); //Ignore all log notifications

const App = () => {
    return <Router></Router>
};

export default App;
