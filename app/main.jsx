var React = require('react');
var ReactDOM = require('react-dom');

import 'whatwg-fetch';
import TestApp from './components/TestApp.jsx';
import Header from './components/Header.jsx';

export class App extends React.Component{
    render(){
      return [
          <Header />,
          <TestApp />
      ];
    }
}

ReactDOM.render(<App />, document.getElementById('content'));