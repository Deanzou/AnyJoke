var voteError = function(authorId, votedUserIds, userObjectId) {
  // Voting not allowed if you're not signed in
  if (!userObjectId) {
    return "Not logged in!";
  }
  // Protect against authors voting for their own Punchlines
  if (authorId === userObjectId) {
    return "Can't vote for your own Punchline!";
  }
  // Protect against duplicate/abusive voting
  var votedUserIds = votedUserIds || [];
  var alreadyVoted = votedUserIds.filter(function(userId) {
    return userId === userObjectId;
  }).length > 0;
  if (alreadyVoted) {
    return "Already voted!";
  }
  // Else, return null
};
if (typeof(exports) !== 'undefined') {
  exports.voteError = voteError;
}
