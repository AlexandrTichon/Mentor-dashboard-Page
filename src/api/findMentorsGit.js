import data from '../../data.json';

function findMentorGroup() {
  const mentorsGit = data.map((group, index) => (
    { label: group.mentorGit.substring(19), value: index + 1 }
  ));
  return mentorsGit;
}

export default findMentorGroup;
