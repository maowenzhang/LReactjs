var React = require('react');
var ReactDOM = require('react-dom');

import 'whatwg-fetch';
import TestApp from './components/TestApp.jsx';

export class App extends React.Component{
    render(){
      return(
          <TestApp />
      );
    }
}

ReactDOM.render(<App />, document.getElementById('content'));