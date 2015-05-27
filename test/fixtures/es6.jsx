import Globalize from 'globalize';
import React from 'react';
import Header from '../Header';
import { FormatCurrency, FormatDate, FormatMessage, FormatNumber, FormatRelativeTime } from 'react-globalize';

/**
 * Import locally scoped styles using css-loader
 * See style.sass in this directory.
 *
 * More info: https://github.com/webpack/css-loader#local-scope
 */
import styles from './style';

export default class Application extends React.Component {
  render() {
    return <div className={styles.main}>
      <div className={styles.wrap}>
        <Header />

        <main className={styles.body}>
          <p><FormatMessage>Seems like creating your own React starter kit is a right of passage. So, here's mine.</FormatMessage></p>
          <p><FormatMessage>Use ReactGlobalize to internationalize your React application.</FormatMessage></p>
          <table style={{width: "100%", marginBottom: "1em"}}>
            <tbody>
              <tr>
                <td><FormatMessage>Standalone Number</FormatMessage></td>
                <td>"<FormatNumber>{12345.6789}</FormatNumber>"</td>
              </tr>
              <tr>
                <td><FormatMessage>Standalone Currency</FormatMessage></td>
                <td>"<FormatCurrency currency="USD">{69900}</FormatCurrency>"</td>
              </tr>
              <tr>
                <td><FormatMessage>Standalone Date</FormatMessage></td>
                <td>"<FormatDate options={{datetime: "medium"}}>{new Date()}</FormatDate>"</td>
              </tr>
              <tr>
                <td><FormatMessage>Standalone Relative Time</FormatMessage></td>
                <td>"<FormatRelativeTime unit="second">{-35}</FormatRelativeTime>"</td>
              </tr>
            </tbody>
          </table>
          <p>
            <FormatMessage
              variables={{
                number: Globalize.formatNumber(12345.6789),
                currency: Globalize.formatCurrency(69900, "USD"),
                date: Globalize.formatDate(new Date(), {datetime: "medium"}),
                relativeTime: Globalize.formatRelativeTime(-35, "second")
              }}
            >{
            "An example of a message using mixed numbers \"{number}\", currencies \"{currency}\", dates \"{date}\", and relative time \"{relativeTime}\"."
            }</FormatMessage>
          </p>
          <p>
            <FormatMessage
              variables={{
                count: 3
              }}
            >{
              "An example of a message with pluralization support: \"\n" +
              "{count, plural,\n" +
              "    one {You have one remaining task}\n" +
              "  other {You have # remaining tasks}\n" +
              "}\""
            }</FormatMessage>
          </p>
          <p>
            <FormatMessage
              elements={{
                globalize: <a href="https://github.com/jquery/globalize/"></a>,
                reactGlobalize: <a href="https://github.com/kborchers/react-globalize"></a>,
                yarsk: <a href="https://github.com/bradleyboy/yarsk#yarsk"></a>
              }}
            >
            For more information, see the [yarsk]YARSK Readme[/yarsk],
            [reactGlobalize]React Globalize Readme[/reactGlobalize], and
            [globalize]Globalize Readme[/globalize].
            </FormatMessage>
          </p>
        </main>
      </div>
    </div>;
  }
}
