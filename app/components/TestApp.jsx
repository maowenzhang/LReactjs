var React = require('react');

import TestItem from './TestItem.jsx';
import StartTest from './StartTest.jsx';
import FinishTest from './FinishTest.jsx';

const TestAppStateEnum = {
    START: 0,
    RUNNING: 1,
    FINISHED: 2 
};

export default class TestApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'currentState': TestAppStateEnum.START,
            'total': 40,
            'data' : {
                'title': 'DISC Test',
                'description': ['first line description', 'second line description'],
                'items': []
            },
            'currentTestNo': 0,
            'currentTest': {'order': 1, 'title': 'first', 'options': [
                        ["1", "option 1", "D"],
                        ["2", "option 2", "D"]
            ]},
            'testResult' : []
        }
    }

    updateStateData() {
        let newTest = this.state.data.items[this.state.currentTestNo];
        this.setState({currentTest : newTest});
    }

    render() {
        if (this.state.currentState == TestAppStateEnum.START) {
            return this.renderStartTest();
        }
        else if (this.state.currentState == TestAppStateEnum.RUNNING) {
            return this.renderTestItem();
        }
        return this.renderFinishTest();
    }

    renderAppHeader() {
        return (
            <div>
                <h2>{this.state.data.title}</h2>
            </div>
        );
    }

    renderStartTest() {
        return (
            <div>
                {this.renderAppHeader()}
                {this.state.data.description.map(item => 
                    <h3>{item}</h3>
                )}
                <StartTest onClick={() => this.handleClickStartTest()}/>
            </div>
        );
    }

    handleClickStartTest() {
        this.setState( {currentState : TestAppStateEnum.RUNNING} );
    }

    renderFinishTest() {
        let testResultCount = {};
        this.state.testResult.forEach(item => testResultCount[item] = (testResultCount[item] || 0) + 1);
        let testResultMessage = JSON.stringify(testResultCount);
        return (
            <div>
                {this.renderAppHeader()}
                <FinishTest {... testResultCount} />
            </div>
        );
    }

    renderTestItem() {
        return (
            <div>
                {this.renderAppHeader()}
                <TestItem 
                    key={this.state.currentTest.order}
                    {... this.state.currentTest}
                    onClick={(order, value) => this.handleClick(order, value)}
                />
            </div>
        );
    }

    handleClick(order, value) {

        this.state.testResult.append((order, value));

        this.state.currentTestNo += 1;

        // Finish testing
        if (this.state.currentTestNo >= this.state.data.items.length) {
            this.setState( {currentState : TestAppStateEnum.FINISHED} );
            return;
        }

        this.updateStateData();
    }

    componentDidMount() {
        // fetch('/api/test/disc')
        $.ajax({
            url: "/static/test/disc-test.json",
            dataType: 'json',
            success: function(data) {
                this.setState({data: data});
                this.updateStateData();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("fail to get disc test data!", status, err.toString());
            }.bind(this)
        });
    }
    
}