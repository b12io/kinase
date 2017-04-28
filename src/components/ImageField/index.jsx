import isUndefined from 'lodash.isundefined';
import mapValues from 'lodash.mapvalues';
import DropzoneComponent from 'react-dropzone-component';
import PropTypes from 'prop-types';
import React from 'react';

import 'dropzone/dist/dropzone.css';
import 'react-dropzone-component/styles/filepicker.css';
import styles from './style.scss';

export default class ImageField extends React.Component {
  constructor(props) {
    super(props);
    const defaultEventHandlers = {
      init: (dropzone) => {
        this.dropzone = dropzone;
        const originalAddedFile = this.dropzone.options.addedfile;
        if (this.props.singleFile) {
          this.dropzone.options.addedfile = (...args) => {
            originalAddedFile.call(this.dropzone, ...args);
            if (!isUndefined(this.dropzone.files[1])) {
              this.dropzone.removeFile(this.dropzone.files[0]);
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
      if (this.dropzone.files.length && file.url === this.dropzone.files[0].url) {
        return;
      }
      this.dropzone.files.push(file); // file must be added manually
      this.dropzone.options.addedfile.call(this.dropzone, file);
      this.dropzone.options.thumbnail.call(this.dropzone, file, file.url);
      this.dropzone.options.complete.call(this.dropzone, file, file.url);
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
