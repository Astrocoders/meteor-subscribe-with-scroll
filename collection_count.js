Meteor.methods({
  'subWithScroll/collectionCount'(options) {
    check(options, {
      collectionName: String,
      params: {
        limit: Number,
        userId: Match.Optional(String),
        isSales: Match.Optional(Boolean)
      }
    });


    var query = {};
    var likes;

    if (_.has(params, 'isSales')) {
      likes = Meteor.users.findOne({_id: params.userId}).likes;
      likes = likes && likes.length > 0  ? likes : [];
      query = params.isSales ? {userId: params.userId} : {_id: {$in: likes}};
    }

    return global[collectionName].find(query).count();
  }
});
