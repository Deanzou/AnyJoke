var util = require("cloud/util.js");

Parse.Cloud.beforeSave("Punchline", function(request, response) {
  if (request.object.get("text").length === 0) {
    response.error("Punchline must not be empty");
  } else {
    response.success();
  }
});

Parse.Cloud.define("vote", function(request, response) {
  var query = new Parse.Query("Punchline");
  query.get(request.params.punchlineId).then(function(punchline) {
    var userId = request.user && request.user.id;
    var votedUsers = punchline.get("votedUsers") || [];
    var votedUserIds = votedUsers.map(function(user) {
      return user.id;
    });
    var reason = util.voteError(punchline.get("author").id, votedUserIds, userId);
    if (!!reason) {
      return Parse.Promise.error(reason);
    }

    // We've passed checks and voting is allowed.
    // Use the Master Key to update the Punchline object (disallowed for
    // arbitrary clients).
    Parse.Cloud.useMasterKey();
    punchline.increment("votes");
    punchline.addUnique("votedUsers", request.user);
    return punchline.save();
  }).then(function(punchlineAgain) {
    response.success("Recorded " + punchlineAgain.get("votes") + " votes");
  }, function(error) {
    response.error(error);
  });
});
