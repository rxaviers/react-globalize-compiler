var Globalize = require("globalize");
var React = require("react");
var Header = require("../Header");
var ReactGlobalize = require("react-globalize");

var Application = React.createClass({
  render: function() {
    return <div className={styles.main}>
      <div className={styles.wrap}>
        <Header />

        <main className={styles.body}>
          <p><ReactGlobalize.FormatMessage>Seems like creating your own React starter kit is a right of passage. So, here's mine.</ReactGlobalize.FormatMessage></p>
          <p><ReactGlobalize.FormatMessage>Use ReactGlobalize to internationalize your React application.</ReactGlobalize.FormatMessage></p>
          <table style={{width: "100%", marginBottom: "1em"}}>
            <tbody>
              <tr>
                <td><ReactGlobalize.FormatMessage>Standalone Number</ReactGlobalize.FormatMessage></td>
                <td>"<ReactGlobalize.FormatNumber>{12345.6789}</ReactGlobalize.FormatNumber>"</td>
              </tr>
              <tr>
                <td><ReactGlobalize.FormatMessage>Standalone Currency</ReactGlobalize.FormatMessage></td>
                <td>"<ReactGlobalize.FormatCurrency currency="USD">{69900}</ReactGlobalize.FormatCurrency>"</td>
              </tr>
              <tr>
                <td><ReactGlobalize.FormatMessage>Standalone Date</ReactGlobalize.FormatMessage></td>
                <td>"<ReactGlobalize.FormatDate options={{datetime: "medium"}}>{new Date()}</ReactGlobalize.FormatDate>"</td>
              </tr>
              <tr>
                <td><ReactGlobalize.FormatMessage>Standalone Relative Time</ReactGlobalize.FormatMessage></td>
                <td>"<ReactGlobalize.FormatRelativeTime unit="second">{-35}</ReactGlobalize.FormatRelativeTime>"</td>
              </tr>
            </tbody>
          </table>
          <p>
            <ReactGlobalize.FormatMessage
              variables={{
                number: Globalize.formatNumber(12345.6789),
                currency: Globalize.formatCurrency(69900, "USD"),
                date: Globalize.formatDate(new Date(), {datetime: "medium"}),
                relativeTime: Globalize.formatRelativeTime(-35, "second")
              }}
            >{
            "An example of a message using mixed numbers \"{number}\", currencies \"{currency}\", dates \"{date}\", and relative time \"{relativeTime}\"."
            }</ReactGlobalize.FormatMessage>
          </p>
          <p>
            <ReactGlobalize.FormatMessage
              variables={{
                count: 3
              }}
            >{
              "An example of a message with pluralization support: \"\n" +
              "{count, plural,\n" +
              "    one {You have one remaining task}\n" +
              "  other {You have # remaining tasks}\n" +
              "}\""
            }</ReactGlobalize.FormatMessage>
          </p>
          <p>
            <ReactGlobalize.FormatMessage
              elements={{
                globalize: <a href="https://github.com/jquery/globalize/"></a>,
                reactGlobalize: <a href="https://github.com/kborchers/react-globalize"></a>,
                yarsk: <a href="https://github.com/bradleyboy/yarsk#yarsk"></a>
              }}
            >
            For more information, see the [yarsk]YARSK Readme[/yarsk],
            [reactGlobalize]React Globalize Readme[/reactGlobalize], and
            [globalize]Globalize Readme[/globalize].
            </ReactGlobalize.FormatMessage>
          </p>
        </main>
      </div>
    </div>;
  }
});

module.exports = Application;
