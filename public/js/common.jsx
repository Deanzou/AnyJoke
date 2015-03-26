var FormMixin = {
  signUp: function() {
    var usernameField = document.getElementById("user_username");
    var passwordField = document.getElementById("user_password");

    var user = new Parse.User();
    user.set("username", usernameField.value);
    user.set("password", passwordField.value);

    // Sign up our new user, then update our state
    user.signUp().then(function(user) {
      usernameField.value = "";
      passwordField.value = "";
    }.bind(this));
  },
  logIn: function() {
    var usernameField = document.getElementById("user_username");
    var passwordField = document.getElementById("user_password");

    // Log the user in, then update our state
    Parse.User.logIn(usernameField.value, passwordField.value).then(function(user) {
      usernameField.value = "";
      passwordField.value = "";
    }.bind(this));
  },
  logOut: function(e) {
    Parse.User.logOut();
    e.preventDefault();
  },
  renderLoggedOut: function() {
    return  <div className="form">
              <input type="text" id="user_username" className="stack" placeholder="Username" />
              <input type="password" id="user_password" className="stack" placeholder="Password" />
              <button className="stack" onClick={ this.signUp }>Sign Up</button>
              <button className="stack" onClick={ this.logIn }>Log In</button>
            </div>
  },
};
