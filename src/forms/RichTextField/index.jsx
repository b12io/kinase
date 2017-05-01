import debounce from 'lodash.debounce';

import PropTypes from 'prop-types';
import React from 'react';
import ReactQuill from 'react-quill';

export default class RichTextField extends React.Component {
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
      <div onBlur={() => this.updateData(this.state.value)}>
        <ReactQuill
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link'],
              ['clean'],
            ],
          }}
          onChange={value => this.updateData(value, true)}
          theme="snow"
          value={this.state.value}
        />
      </div>
    );
  }
}

RichTextField.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
};
RichTextField.defaultProps = {
  onChange: () => undefined,
  value: '',
};
