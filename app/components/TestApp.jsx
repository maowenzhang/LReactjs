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
                'title': 'DISC性格测试',
                'description': ['在每一个大标题中的四个选择题中只选择一个最符合你自己的，一共40题。注意：请按第一印象最快的选择，如果不能确定，可回忆童年时的情况，或者以你最熟悉的人对你的评价来从中选择。'],
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
        return (
            <div className="jumbotron">
                <h2 className="bigTitle">{this.state.data.title}</h2>
                {this.renderOthers()}
            </div>
        );
    }
    renderOthers() {
        if (this.state.currentState == TestAppStateEnum.START) {
            return this.renderStartTest();
        }
        else if (this.state.currentState == TestAppStateEnum.RUNNING) {
            return this.renderTestItem();
        }
        return this.renderFinishTest();
    }

    renderStartTest() {
        return (
            <div>
                <StartTest 
                    title={this.state.data.title}
                    description={this.state.data.description}
                    onClick={() => this.handleClickStartTest()}/>
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
        let count_D = testResultCount['D'] || 0;
        let count_I = testResultCount['I'] || 0;
        let count_S = testResultCount['S'] || 0;
        let count_C = testResultCount['C'] || 0;
        let newmsg = `结果统计: D-${count_D}, I-${count_I}, S-${count_S}, C-${count_C}`;
        return (
            <div>
                <FinishTest message={newmsg} {... testResultCount} />
            </div>
        );
    }

    renderTestItem() {
        return (
            <div>
                <div className="text-left">
                    {this.state.data.description.map((item,index) => <p key={index}>{item}</p>)}
                </div>
                <TestItem 
                    key={this.state.currentTest.order}
                    {... this.state.currentTest}
                    onClick={(order, value) => this.handleClick(order, value)}
                />
            </div>
        );
    }

    handleClick(order, value) {

        this.state.testResult.push((order, value));

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