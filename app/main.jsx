import React from 'react';
import ReactDOM from 'react-dom';
import TestApp from './components/TestApp.jsx'; 
import Header from './components/Header.jsx';

// import LoginPage from './account/LoginPage.jsx';
// import SignUpPage from './account/SignUpPage.jsx';
// import { BrowserRouter, Route } from 'react-router-dom';

var headerContainer = document.getElementById('navbar-right-part');
ReactDOM.render((
        <Header 
            user={headerContainer.getAttribute('user')}
        />
    ),
    headerContainer
);

if (document.getElementById('react-app')) {
ReactDOM.render(<TestApp />, document.getElementById('react-app'));
}


// import { browserHistory } from 'react-router';

// import createBrowserHistory from 'history/createBrowserHistory'
// const newHistory = createBrowserHistory();

// ReactDOM.render((
//         <div>
//             <BrowserRouter>
//                 <Route path="/" component={TestApp}/>
//             </BrowserRouter>
//             <BrowserRouter>
//                 <Route path="/login" component={LoginPage}/>
//             </BrowserRouter>
//             <BrowserRouter>
//                 <Route path="/signup" component={SignUpPage}/>
//             </BrowserRouter>
//         </div>
//     ),
//     document.getElementById('react-app')
// );
