var SetupTile = React.createClass({
  render: function() {
    var url = "/setup/#" + this.props.setup.objectId;
    return  <div className="setup">
              <a href={ url }>{ this.props.setup.text }</a> &mdash; ({ this.props.setup.author.username })
            </div>
  }
});

var NewSetupForm = React.createClass({
  mixins: [ ParseReact.Mixin, FormMixin ],
  observe: function() {
    return {
      // Subscribe to the current user, and attach the result to this.data.user
      user: ParseReact.currentUser
    };
  },
  newSetup: function() {
    var setupField = document.getElementById("setup_text");

    ParseReact.Mutation.Create("Setup", {
      text: setupField.value,
      // Convert a Parse.User to a plain object for working with Mutations
      author: this.data.user.toPlainObject()
    }).dispatch().then(function() {
      setupField.value = "";
    });
  },
  renderLoggedIn: function() {
    return  <div>
              <div className="form">
                <input type="text" id="setup_text" className="stack" placeholder="New Joke Setup" />
                <button className="stack" onClick={ this.newSetup }>Submit</button>
              </div>
              <a href="#" className="logout" onClick={ this.logOut } >Log Out</a>
            </div>
  },
  render: function() {
    return this.data.user ? this.renderLoggedIn() : this.renderLoggedOut();
  }
});

var Index = React.createClass({
  mixins: [ ParseReact.Mixin ], // This is needed to provide observe() functionality
  observe: function() {
    return {
      // Subscribe to a Query, and attach the results to this.data.setups
      setups: new Parse.Query("Setup")
                    .include("author")
                    .limit(10)
    }
  },
  render: function() {
    return  <div id="index">
              <h1>AnyJoke</h1>
              { this.data.setups.map(function(setup) {
                return <SetupTile setup={ setup } />
              }) }
              <NewSetupForm />
            </div>
  }
});

React.render(<Index />, document.body);
