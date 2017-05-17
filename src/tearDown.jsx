/* global document */

import styles from 'main.scss';
import componentStyles from 'components/Main/style.scss';

if (document.getElementsByClassName(styles.reactRoot).length) {
  const wrapper = document.getElementsByClassName(componentStyles.kinaseMain)[0];
  document.body.innerHTML = wrapper.innerHTML;
}
