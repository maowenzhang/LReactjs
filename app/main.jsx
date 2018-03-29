import React from 'react';
// import ReactDom from 'react-dom';
import TestApp from './components/TestApp.jsx'; 
import Header from './components/Header.jsx';
import LoginPage from './account/LoginPage.jsx';
import SignUpPage from './account/SignUpPage.jsx';
import { BrowserRouter, Route } from 'react-router-dom';

// export class App extends React.Component{
//     render(){
//       return [
//           <Header />,
//           <TestApp />
//       ];
//     }
// }

// ReactDOM.render(<App />, document.getElementById('content'));

// import { browserHistory } from 'react-router';

// import createBrowserHistory from 'history/createBrowserHistory'
// const newHistory = createBrowserHistory();

ReactDOM.render((
        <div>
            <BrowserRouter>
                <Route path="/" component={TestApp}/>
            </BrowserRouter>
            <BrowserRouter>
                <Route path="/login" component={LoginPage}/>
            </BrowserRouter>
            <BrowserRouter>
                <Route path="/signup" component={SignUpPage}/>
            </BrowserRouter>
        </div>
    ),
    document.getElementById('react-app')
);

ReactDOM.render((
        <Header />
    ),
    document.getElementById('navbar-right-part')
);
