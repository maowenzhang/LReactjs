// import ReactDOM from 'react-dom';
import TestApp from './components/TestApp.jsx'; 
import Header from './components/Header.jsx';
import Invite from './components/Invite.jsx';
import Result from './components/Result.jsx';
import SignUpForm from './components/SignUpForm.jsx';

var headerContainer = document.getElementById('navbar-right-part');
ReactDOM.render((
        <Header 
            userEmail={headerContainer.getAttribute('userEmail')}
            userName={headerContainer.getAttribute('userName')}
            userId={headerContainer.getAttribute('userId')}
            userRole={headerContainer.getAttribute('userRole')}
        />
    ),
    headerContainer
);

if (document.getElementById('react-app')) {
    ReactDOM.render(<TestApp />, document.getElementById('react-app'));
}

if (document.getElementById('invite-app')) {
    ReactDOM.render(<Invite />, document.getElementById('invite-app'));
}

if (document.getElementById('result-app')) {
    ReactDOM.render(<Result />, document.getElementById('result-app'));
}

if (document.getElementById('signup-app')) {
    ReactDOM.render(<SignUpForm />, document.getElementById('signup-app'));
}