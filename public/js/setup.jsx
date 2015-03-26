var PunchlineVoteTD = React.createClass({
  mixins: [ ParseReact.Mixin ],
  getInitialState: function() {
    return {
      voted: false,
      numVotes: this.props.punchline.votes || 0
    }
  },
  observe: function() {
    return {
      // Subscribe to the current user, and attach the result to this.data.user
      user: ParseReact.currentUser
    };
  },
  vote: function(punchlineId) {
    this.setState({ voted: true, numVotes: this.state.numVotes + 1 });
    Parse.Cloud.run("vote", { punchlineId: punchlineId }).then(function() {
      this.props.onVote();
    }.bind(this));
  },
  enabled: function() {
    var authorId = this.props.punchline.author.objectId;
    var votedUsers = this.props.punchline.votedUsers || [];
    var votedUserIds = votedUsers.map(function(user) {
      return user.objectId
    });
    var currentUserId = this.data.user && this.data.user.objectId;
    return !this.state.voted && !voteError(authorId, votedUserIds, currentUserId);
  },
  render: function() {
    return  <td className="vote">
              <b>Votes:</b> { this.state.numVotes }
              {
                !this.enabled() ? false :
                  <input type="button" onClick={ this.vote.bind(this, this.props.punchline.objectId ) } value="Cast Vote" />
              }
            </td>
  }
});

var PunchlineItem = React.createClass({
  render: function() {
    return  <tr>
              <td>
                { this.props.punchline.author.username }:
              </td>
              <td>
                { this.props.punchline.text }
              </td>
              <PunchlineVoteTD punchline={ this.props.punchline } onVote={ this.props.onVote } />
            </tr>
  }
});

var PunchlineList = React.createClass({
  mixins: [ ParseReact.Mixin ],
  observe: function(props, state) {
    // Parse.Query expects a Parse.Object instance, in order to build the query correctly.
    var setupPointer = new Parse.Object("Setup");
    setupPointer.id = this.props.setup.objectId;
    return {
      punchlines: new Parse.Query("Punchline")
                      .equalTo("setup", setupPointer)
                      .descending("votes")
                      .include("author")
    }
  },
  onVote: function() {
    this.refreshQueries();
  },
  render: function() {
    if (this.pendingQueries().length > 0) {
      return <p>Loading...</p>
    }
    if (this.data.punchlines.length === 0) {
      return <p>No punchlines submitted! Suggest one?</p>
    }
    return  <table>
              <tbody>
                <tr>
                  <th>Punchline</th>
                  <th>Author</th>
                  <th>Votes</th>
                </tr>
                { this.data.punchlines.map(function(punchline) {
                  return <PunchlineItem key={ punchline.objectId } punchline={ punchline } onVote={ this.onVote } />
                }.bind(this)) }
              </tbody>
            </table>
  }
});

var NewPunchlineForm = React.createClass({
  mixins: [ ParseReact.Mixin, FormMixin ],
  observe: function() {
    return {
      // Subscribe to the current user, and attach the result to this.data.user
      user: ParseReact.currentUser
    };
  },
  newPunchline: function() {
    var punchlineField = document.getElementById("punchline_text");

    ParseReact.Mutation.Create("Punchline", {
      setup: this.props.setup,
      text: punchlineField.value,
      // Convert a Parse.User to a plain object for working with Mutations
      author: this.data.user.toPlainObject()
    }).dispatch().then(function() {
      punchlineField.value = "";
    });
  },
  renderLoggedIn: function() {
    return  <div>
              <div className="row form">
                <input type="text" id="punchline_text" className="stack" placeholder="New Punchline" />
                <button className="stack" onClick={ this.newPunchline }>Submit</button>
              </div>
              <a href="#" className="logout" onClick={ this.logOut } >Log Out</a>
            </div>
  },
  render: function() {
    return this.data.user ? this.renderLoggedIn() : this.renderLoggedOut();
  }
});

var Show = React.createClass({
  mixins: [ ParseReact.Mixin ], // This is needed to provide observe() functionality
  observe: function() {
    return {
      setups: new Parse.Query("Setup")
                  .include("author")
                  .equalTo("objectId", window.location.hash.substr(1, 10)),
    }
  },
  render: function() {
    if (this.pendingQueries().length > 0) {
      return <div id="show">Loading...</div>
    }
    if (this.data.setups.length === 0) {
      return <div id="show">No Setup found! Did you follow a bad URL?</div>
    }

    var setup = this.data.setups[0];
    return  <div id="show">
              <h2>{ setup.text }</h2>
              <div className="row">
                <div className="col four-fifth" />
                <div className="col fifth">
                  &mdash; { setup.author.username }
                </div>
              </div>
              <PunchlineList setup={ setup } />
              <NewPunchlineForm setup={ setup } />
            </div>
  }
});

React.render(<Show />, document.body);
