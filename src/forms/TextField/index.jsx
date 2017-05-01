import debounce from 'lodash.debounce';

import PropTypes from 'prop-types';
import React from 'react';

export default class TextField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value };
    this.onChangeDebounced = debounce(
      value => this.props.onChange(value), 500, {
        leading: true,
        trailing: true,
      });
  }

  componentWillReceiveProps({ value }) {
    this.setState({ value });
  }

  updateData(value, debounced = false) {
    this.setState({ value }, () => {
      if (debounced) {
        this.onChangeDebounced(value);
      } else {
        this.props.onChange(value);
      }
    });
  }

  render() {
    return (
      <textarea
        onBlur={() => this.updateData(this.state.value)}
        onChange={event => this.updateData(event.target.value, true)}
        type="text"
        value={this.state.value}
      />
    );
  }
}

TextField.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
};
TextField.defaultProps = {
  onChange: () => undefined,
  value: '',
};
