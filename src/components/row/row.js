import React, { Fragment } from 'react';

import PropTypes from 'prop-types';

import Ceil from '../ceil/ceil';

class Row extends React.Component {
  constructor() {
    super();
    this.displayData = [];
    this.appendCeil.bind(this);
  }

  componentDidMount() {
    const { ceilsArray, statusArray } = this.props;
    for (let i = 0; i < ceilsArray.length; i += 1) {
      this.appendCeil(ceilsArray[i], statusArray[i]);
    }
  }

  appendCeil(data, status) {
    this.displayData.push(<Ceil data={data} status={status} />);
    this.forceUpdate();
  }

  render() {
    return (
      <Fragment>
        {this.displayData}
      </Fragment>
    );
  }
}

Row.defaultProps = {
  ceilsArray: [],
  statusArray: [],
};

Row.propTypes = {
  ceilsArray: PropTypes.instanceOf(Array),
  statusArray: PropTypes.instanceOf(Array),
};

export default Row;
