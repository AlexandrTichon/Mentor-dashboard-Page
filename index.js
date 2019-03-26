const fs = require('fs');
const XLSX = require('xlsx');

// this file contain mentore score
const mentorScore = XLSX.readFile('Sheets/Mentor score.xlsx');

// FIELDMAPPING to mentor score table
const FIELDMAPPING_MENTORSCORE = {
  date: 'A',
  mentorGit: 'B',
  studentGit: 'C',
  taskName: 'D',
  prLink: 'E',
  mark: 'F',
  comments: 'G',
  actions: 'H',
};

// this file contain pairs and mentors info
const mentorStudentsDependencies = XLSX.readFile('Sheets/Mentor-students pairs.xlsx');

// FIELDMAPPING to pairs of mentor and student table
const FIELDMAPPING_PAIRS = {
  mentorName: 'A',
  studentGit: 'B',
};

// FIELDMAPPING to mentor info table
const FIELDMAPPING_MENTORGIT = {
  mentorName: 'A',
  mentorSurname: 'B',
  mentorCity: 'C',
  studentsCount: 'D',
  mentorGit: 'E',
};

// tasks names
const tasksNames = ['Code Jam \"CoreJS\"', 'Code Jam \"CV\"', 'Code Jam \"DOM, DOM Events\"', 'Markup #1',
  'RS Activist', 'Presentation', 'YouTube', 'Code Jam \"Scoreboard\"', 'Game'];

function getDataFromCeil(cell, dataFormat) {
  switch (dataFormat) {
    case 'date':
      if (cell) {
        return cell.w;
      }
      return '';
    case 'other':
      if (cell) {
        return cell.v;
      }
      return '';
    default:
      console.error('Sorry, check your data format');
      return false;
  }
}

function getDataFromRow(sheet, list, currentRow, fieldMapping) {
  const currentSheet = sheet.Sheets[list];

  const dataObject = {};
  Object.keys(fieldMapping).forEach((propName) => {
    dataObject[propName] = '';
    return true;
  });

  const objKeys = Object.keys(dataObject);
  objKeys.forEach((prop) => {
    if (prop === 'date') {
      dataObject[prop] = getDataFromCeil(currentSheet[fieldMapping.date + currentRow], 'date');
    } else {
      dataObject[prop] = getDataFromCeil(currentSheet[fieldMapping[prop] + currentRow], 'other');
    }
  });
  return dataObject;
}

function getDataFromRows(sheet, list, fieldMapping) {
  const rows = [];
  let countOfRows = 2; // not counted title and 0 row
  while (true) {
    if (sheet.Sheets[list][`A${countOfRows}`]) {
      rows.push(countOfRows);
      countOfRows += 1;
    } else {
      break;
    }
  }
  return rows.map(row => getDataFromRow(sheet, list, row, fieldMapping));
}

function writeDataToJSON(data) {
  const dataJSON = JSON.stringify(data, 0, 2);
  fs.writeFile('data.json', dataJSON, 'utf8', () => {
    console.log('writing is done!');
  });
  return true;
}

function addGitMentorGitToPairs(pairs, mentorGit) {
  const mentorDashboard = [];
  mentorGit.forEach((mentor) => {
    const mentorGroup = {};
    mentorGroup.mentorName = `${mentor.mentorName} ${mentor.mentorSurname}`;
    mentorGroup.mentorGit = mentor.mentorGit;
    mentorDashboard.push(mentorGroup);
  });

  mentorDashboard.forEach((mentorGroup) => {
    const currentPairs = pairs.filter(pair => pair.mentorName === mentorGroup.mentorName);
    mentorGroup.students = [];
    currentPairs.forEach((pair) => {
      mentorGroup.students.push({ studentGit: `https://github.com/${pair.studentGit}` });
    });
  });
  return mentorDashboard;
}

function addTasksInfo(dashboard, score) {
  dashboard.forEach((mentorGroup) => {
    mentorGroup.students.forEach((student) => {
      student.tasks = [];
      const currentTasks = score
        .filter(task => task.studentGit.toLowerCase() === student.studentGit.toLowerCase());

      currentTasks.forEach((element) => {
        const taskElement = {
          date: element.date,
          taskName: element.taskName,
          prLink: element.prLink,
          mark: element.mark,
          comments: element.comments,
        };
        student.tasks.push(taskElement);
      });
    });
  });
  return dashboard;
}

function clearEmpty(dashboard) {
  dashboard.forEach((mentorGroup) => {
    mentorGroup.students = mentorGroup.students.filter(student => student.tasks.length >= 1);
  });
  return dashboard;
}

function setTaskStatus(dashboard) {
  const CHECKED = 'checked';
  const FAIL = 'fail';
  const TODO = 'todo';
  const WORKING_NOW = 'working-now';
  const NEED_TO_CHECK = 'need-to-check';
  dashboard.forEach((mentorGroup) => {
    mentorGroup.students.forEach((student) => {
      const studentTasks = student.tasks.map(task => task.taskName);
      tasksNames.forEach((task) => {
        const studentCurrentTask = studentTasks.find(element => element === task);
        // if tasks dont contain task
        if (studentCurrentTask) {
          student.tasks[student.tasks
            .findIndex(element => element.taskName === task)].status = CHECKED;
        } else if (task.includes('Code Jam')) {
          student.tasks.push(
            {
              taskName: task,
              mark: 0,
              comments: 'Task is fail',
              status: FAIL,
            },
          );
        } else if (task === 'RS Activist') {
          student.tasks.push(
            {
              taskName: task,
              status: TODO,
            },
          );
        } else if (task === 'Game') {
          student.tasks.push(
            {
              taskName: task,
              status: WORKING_NOW,
            },
          );
        } else {
          student.tasks.push(
            {
              taskName: task,
              status: NEED_TO_CHECK,
            },
          );
        }
      });
    });
  });
}

function createDashboard(pairs, mentorGit, score) {
  // join mentorGit, name and students git;
  let mentorDashboard = addGitMentorGitToPairs(pairs, mentorGit);
  addTasksInfo(mentorDashboard, score);
  clearEmpty(mentorDashboard);
  mentorDashboard = mentorDashboard.filter(mentorGroup => mentorGroup.students.length > 1);
  setTaskStatus(mentorDashboard);
  writeDataToJSON(mentorDashboard);
  return mentorDashboard;
}

const resultMentorScore = getDataFromRows(mentorScore, 'Form Responses 1', FIELDMAPPING_MENTORSCORE);
const resultPairs = getDataFromRows(mentorStudentsDependencies, 'pairs', FIELDMAPPING_PAIRS);
const resultMentorGit = getDataFromRows(mentorStudentsDependencies, 'second_name-to_github_account', FIELDMAPPING_MENTORGIT);

createDashboard(resultPairs, resultMentorGit, resultMentorScore);
