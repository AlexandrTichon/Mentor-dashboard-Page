import React from 'react';
import Select from 'react-select';

import PropTypes from 'prop-types';
import findMentorGit from '../../api/findMentorsGit';


const mentorsGit = findMentorGit();

class Search extends React.Component {
  onSubmit(data) {
    const { callback } = this.props;
    callback(data.label);
  }

  render() {
    return (
      <div className="searchPanel">
        <Select options={mentorsGit} onChange={this.onSubmit.bind(this)} />
      </div>
    );
  }
}

Search.propTypes = {
  callback: PropTypes.func.isRequired,
};

export default Search;
