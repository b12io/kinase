import isUndefined from 'lodash.isundefined';
import mapValues from 'lodash.mapvalues';
import DropzoneComponent from 'react-dropzone-component';
import PropTypes from 'prop-types';
import React from 'react';

import 'dropzone/dist/dropzone.css';
import 'react-dropzone-component/styles/filepicker.css';
import styles from './style.scss';

let dropzone;
export default class ImageField extends React.Component {
  constructor(props) {
    super(props);
    const defaultEventHandlers = {
      init: (_dropzone) => {
        dropzone = _dropzone;
        const originalAddedFile = dropzone.options.addedfile;
        if (this.props.singleFile) {
          dropzone.options.addedfile = (...args) => {
            originalAddedFile.call(dropzone, ...args);
            if (!isUndefined(dropzone.files[1])) {
              dropzone.removeFile(dropzone.files[0]);
            }
          };
        }
      },
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

  componentDidMount() {
    this.loadInitialFile(this.props.file);
  }

  componentWillReceiveProps(nextProps) {
    this.loadInitialFile(nextProps.file);
  }

  loadInitialFile(file) {
    if (file) {
      if (dropzone.files.length && file.url === dropzone.files[0].url) {
        return;
      }
      dropzone.files.push(file); // file must be added manually
      dropzone.options.addedfile.call(dropzone, file);
      dropzone.options.thumbnail.call(dropzone, file, file.url);
      dropzone.options.complete.call(dropzone, file, file.url);
    }
  }

  render() {
    return (
      <span className={styles.imageField}>
        <DropzoneComponent
          config={{ postUrl: 'no-url' }}
          djsConfig={{ clickable: false }}
          eventHandlers={this.eventHandlers}
        />
      </span>
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
