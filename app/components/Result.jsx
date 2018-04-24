import React from 'react';
import Message from './Message.jsx';
import Spinner from './Spinner.jsx';

export default class Result extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        messageOption: {
          message: '',
          errorMessage: '',
          show: true,
          simpleFormat: true
        }
      }
    }

    render() {
      return (
        <div className="container">
            <h2>测试结果</h2>
            <Spinner className="data-panel-spinner" show={this.state.isLoading}/>
            <table data-pagination="true" data-search="true" data-toggle="table" data-url="/test-result-data">
                <thead>
                    <tr>
                        <th data-sortable="true" data-field="id">用户ID</th>
                        <th data-sortable="true" data-field="userName">姓名</th>
                        <th data-sortable="true" data-field="email">Email</th>
                        <th data-sortable="true" data-field="userRole">用户角色</th>
                        <th data-field="disc">DISC 测试结果</th>
                        <th data-field="testDate">测试完成时间</th>
                    </tr>
                </thead>
            </table>
            <Message {... this.state.messageOption}/>
        </div>
      );
    }

    componentDidMount() {
      var that = this;

      var data = {};
      $.ajax({
          url: "/test-result",
          success: function(result) {
            that.state.isLoading = false;
            that.setState(that.state);
          },
          error: function(xhr, status, err) {
            console.error("Failed to invite user ", status, err);
            that.state.messageOption.errorMessage = err;
            that.state.isLoading = false;
            that.setState(that.state);
          }
      }); 
    }
  }