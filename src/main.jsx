/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import Test from './Test';

const container = document.createElement('div');
container.setAttribute('id', 'app-wrapper');
document.body.appendChild(container);

ReactDOM.render(<Test />, container);
