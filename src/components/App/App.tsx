import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Search from '../../screens/Search';
import Home from '../../screens/Home';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/search/:keyword?" exact component={Search} />
    </Router>
  );
}

export default App;
