import React from 'react';

import PropTypes from 'prop-types';
import nanoid from 'nanoid';
import cn from 'classnames';

const Ceil = ({ data, status }) => (
  <div className={cn('ceil', status)} id={nanoid()}>
    {data}
  </div>
);

Ceil.defaultProps = {
  data: '',
  status: '',
};

Ceil.propTypes = {
  data: PropTypes.string,
  status: PropTypes.string,
};

export default Ceil;
