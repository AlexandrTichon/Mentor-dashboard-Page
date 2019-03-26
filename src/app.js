import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import Table from './components/table/table';
import SearchPanel from './components/searchPanel/searchPanel';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      searchData: localStorage.getItem('mentorGit') || '',
    };
  }

  transferData(query) {
    this.setState({
      searchData: query,
    });
  }

  render() {
    const { searchData } = this.state;
    return (
      <Fragment>
        <SearchPanel callback={this.transferData.bind(this)} />
        <div className="label">{searchData}</div>
        <Table findObj={searchData} />
      </Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
