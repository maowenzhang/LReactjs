var React = require('react');

export default class Header extends React.Component {
    render() {
        return (
            <div id="navbar" class="navbar-collapse collapse">
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
                <ul className="nav navbar-nav navbar-right">
                    <li className=""><a href="/login">登陆</a></li>
                    <li ><a href="/signup">注册</a></li>
                </ul>
            </div>
        );
    }
}