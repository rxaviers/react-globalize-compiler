/*
 * es6 code with both FormatMessage and Globalize.formatMessage
 */
import Globalize from 'globalize';
import { FormatMessage } from 'react-globalize';
import React from 'react';

const label = Globalize.formatMessage('Header');
const photoTitle = Globalize.messageFormatter(
  `{user}'s {count, plural,
      one {photo}
    other {photos}}`
);

export default class Header extends React.Component {
  render() {
    return <div aria-label={label}>
      <FormatMessage>My Header</FormatMessage>
    </div>;
  }
}
