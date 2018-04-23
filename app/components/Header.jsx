var React = require('react');
// import { Link, IndexLink } from 'react-router';

export default class Header extends React.Component {
    render() {
        return (
            <div id="navbar" className="navbar-collapse collapse">
                {/* <ul className="nav navbar-nav">
                    <li><a href="#">About</a></li>
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
                        <ul className="dropdown-menu">
                            <li><a href="#">Action</a></li>
                            <li role="separator" class="divider"></li>
                        </ul>
                    </li>
                </ul> */}
                {this.renderUserOrLogin()}
                {this.renderAdminFeatures()}
            </div>
        );
    }

    isAdmin() {
        if (this.props.userRole === 'admin') {
            return true;
        }
        return false;
    }

    renderAdminFeatures() {
        if (!this.isAdmin()) {
            return (<div/>);
        }

        return (
            <div>
                <ul className="nav navbar-nav navbar-right">
                    <li className=""><a href="/invite">邀请好友</a></li>
                    <li ><a href="/test-result">测试记录</a></li>
                    <li className="divider-vertical"></li>
                </ul>
            </div>
        );
    }

    isLogin() {
        if (this.props.user) {
            return true;
        }
        return false;
    }

    renderUserOrLogin() {
        if (this.isLogin()) {
            return this.renderUserInfo();
        } else {
            return this.renderLogin();
        }
    }

    renderLogin() {
        return (
            <ul className="nav navbar-nav navbar-right">
                <li className=""><a href="/login">登陆</a></li>
                <li ><a href="/signup">注册</a></li>
            </ul>
        );
    }

    renderUserInfo() {
        return (
            <ul className="nav navbar-nav navbar-right">
                <li className=""><a id="id-user" href="#">欢迎 {this.props.user}</a></li>
                <li ><a href="/logout">退出</a></li>
            </ul>
        );
    }
}