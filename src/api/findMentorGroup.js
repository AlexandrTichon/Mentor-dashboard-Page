import data from '../../data.json';

function findMentorGroup(gitLink) {
  const group = data.find(mentorGroup => mentorGroup.mentorGit === `https://github.com/${gitLink}`);
  return group;
}

export default findMentorGroup;
