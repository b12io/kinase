import isNil from 'lodash.isnil';
import mapValues from 'lodash.mapvalues';
import DropzoneComponent from 'react-dropzone-component';
import PropTypes from 'prop-types';
import React from 'react';

import 'react-dropzone-component/styles/filepicker.css';

let dropzone;
export default class ImageField extends React.Component {
  constructor(props) {
    super(props);
    const defaultEventHandlers = {
      init: (_dropzone) => {
        dropzone = _dropzone;
      },
      addedfile: this.addFile.bind(this),
    };
    this.eventHandlers = {
      ...props.eventHandlers,
      ...mapValues(defaultEventHandlers, (handler, name) => (...args) => {
        handler(...args);
        if (props.eventHandlers[name]) {
          props.eventHandlers[name](...args);
        }
      }),
    };
  }

  componentWillReceiveProps({ file }) {
    if (file) {
      dropzone.files.push(file); // file must be added manually
      dropzone.emit('addedfile', file);
      dropzone.emit('thumbnail', file, file.url);
      dropzone.emit('complete', file);
    }
  }

  addFile() {
    if (this.props.singleFile) {
      if (!isNil(dropzone.files[1])) {
        dropzone.removeFile(dropzone.files[0]);
      }
    }
  }

  render() {
    return (
      <DropzoneComponent
        config={{ postUrl: 'no-url' }}
        djsConfig={{ clickable: false }}
        eventHandlers={this.eventHandlers}
      />
    );
  }
}

ImageField.propTypes = {
  eventHandlers: PropTypes.objectOf(PropTypes.func),
  file: PropTypes.shape({
    url: PropTypes.string.isRequired,
    type: PropTypes.string,
    size: PropTypes.number.isRequired,
  }),
  singleFile: PropTypes.bool,
};
ImageField.defaultProps = {
  eventHandlers: {},
  singleFile: false,
  file: null,
};
