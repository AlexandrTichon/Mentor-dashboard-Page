import React from 'react';
import PropTypes from 'prop-types';

import Row from '../row/row';

import findMentorGroup from '../../api/findMentorGroup';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnsNames: ['Tasks Names'],
      query: '',
      tasksNames: [
        'Code Jam \"CoreJS\"', 'Code Jam \"CV\"', 'Code Jam \"DOM, DOM Events\"', 'Markup #1',
        'RS Activist', 'Presentation', 'YouTube', 'Code Jam \"Scoreboard\"', 'Game',
      ],
      rowNumber: 9,
      displayData: [], // this array contain Ceils
    };

    this.getData.bind(this);
    this.appendRow.bind(this);
    this.setTableSettings.bind(this);
  }

  componentWillMount() {
    const { findObj } = this.props;
    if (findObj !== '') {
      this.setState({
        columnsNames: ['Tasks Names'],
        query: findObj,
        tasksNames: [
          'Code Jam \"CoreJS\"', 'Code Jam \"CV\"', 'Code Jam \"DOM, DOM Events\"', 'Markup #1',
          'RS Activist', 'Presentation', 'YouTube', 'Code Jam \"Scoreboard\"', 'Game',
        ],
        rowNumber: 9,
        displayData: [], // this array contain Ceils
      });
    }
  }

  componentDidMount() {
    if (localStorage.getItem('mentorGit')) {
      window.addEventListener('load', this.getData());
    }
  }

  componentWillReceiveProps(nextProps) {
    const { findObj } = this.props;
    if (nextProps.findObj !== findObj) {
      this.setState({
        columnsNames: ['Tasks Names'],
        query: nextProps.findObj,
        tasksNames: [
          'Code Jam \"CoreJS\"', 'Code Jam \"CV\"', 'Code Jam \"DOM, DOM Events\"', 'Markup #1',
          'RS Activist', 'Presentation', 'YouTube', 'Code Jam \"Scoreboard\"', 'Game',
        ],
        rowNumber: 9,
        displayData: [], // this array contain Ceils
      }, () => {
        this.getData();
      });
    }
  }

  componentDidUpdate() {
    this.setTableSettings();
  }

  setTableSettings() {
    const { columnsNames } = this.state;
    const table = document.querySelector('.table');

    // dinamically grid settings
    table.style.gridTemplateColumns = `repeat(${columnsNames.length}, 150px)`;
    table.style.gridTemplateRows = 'repeat(10, 50px)';
  }

  getData() {
    const {
      columnsNames, query, tasksNames, rowNumber,
    } = this.state;
    const mentorGroup = findMentorGroup(query);
    const studentsGits = [];

    localStorage.setItem('mentorGit', query); // local save
    mentorGroup.students.forEach((student) => {
      studentsGits.push(student.studentGit.substring(19));
    });

    const ceilStatus = ['table-head'];
    studentsGits.forEach((studentGit) => {
      ceilStatus.push('table-head');
      columnsNames.push(studentGit);
    });
    this.appendRow(columnsNames, ceilStatus);

    for (let i = 0; i < rowNumber; i += 1) {
      const currentRow = [tasksNames[i]]; // contain strings
      const groupTaskState = '';
      const taskStatusArray = [groupTaskState]; // contain status
      mentorGroup.students.forEach((student) => {
        const currentTask = student.tasks
          .find(task => task.taskName === tasksNames[i]);
        currentRow.push('');
        taskStatusArray.push(currentTask.status);
      });
      let taskCompleteIndicator = true;
      for (let j = 1; j < taskStatusArray.length; j += 1) {
        if (taskStatusArray[j] !== 'checked') taskCompleteIndicator = false;
      }
      taskStatusArray[0] = taskCompleteIndicator ? 'task-name checked' : 'task-name';
      this.appendRow(currentRow, taskStatusArray);
    }
  }

  appendRow(ceilArray, statusArray = []) {
    const { displayData } = this.state;
    displayData.push(<Row ceilsArray={ceilArray} statusArray={statusArray} />);
    this.forceUpdate();
  }

  render() {
    const { displayData } = this.state;
    return (
      <div className="table">
        {displayData}
      </div>
    );
  }
}

Table.propTypes = {
  findObj: '',
};

Table.propTypes = {
  findObj: PropTypes.string.isRequired,
};

export default Table;
