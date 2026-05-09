// Domain logic for Social Mart: users, posts, comments, likes, follows, saves, notifications
import Types "../types/social";
import Common "../types/common";
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Int "mo:core/Int";

module {
  // ---- Composite key helpers ----

  public func likeKey(userId : Common.UserId, postId : Common.PostId) : Text {
    userId.toText() # ":" # postId
  };

  public func followKey(followerId : Common.UserId, followeeId : Common.UserId) : Text {
    followerId.toText() # ":" # followeeId.toText()
  };

  public func savedKey(userId : Common.UserId, postId : Common.PostId) : Text {
    userId.toText() # ":" # postId
  };

  // ---- Helpers: convert mutable internal types to shared public types ----

  public func userToPublic(u : Types.User) : Types.UserPublic {
    {
      uid = u.uid;
      username = u.username;
      email = u.email;
      bio = u.bio;
      avatarUrl = u.avatarUrl;
      followersCount = u.followersCount;
      followingCount = u.followingCount;
    }
  };

  public func postToPublic(p : Types.Post) : Types.PostPublic {
    {
      postId = p.postId;
      userId = p.userId;
      imageUrl = p.imageUrl;
      caption = p.caption;
      likesCount = p.likesCount;
      commentsCount = p.commentsCount;
      createdAt = p.createdAt;
    }
  };

  public func commentToPublic(c : Types.Comment) : Types.CommentPublic {
    {
      commentId = c.commentId;
      postId = c.postId;
      userId = c.userId;
      text = c.text;
      createdAt = c.createdAt;
    }
  };

  // ---- User logic ----

  public func registerUser(
    users : Map.Map<Common.UserId, Types.User>,
    uid : Common.UserId,
    username : Text,
    email : Text,
  ) : Bool {
    if (users.containsKey(uid)) {
      return false;
    };
    let user : Types.User = {
      uid;
      var username;
      var email;
      var bio = "";
      var avatarUrl = "";
      var followersCount = 0;
      var followingCount = 0;
    };
    users.add(uid, user);
    true
  };

  public func getUser(
    users : Map.Map<Common.UserId, Types.User>,
    uid : Common.UserId,
  ) : ?Types.UserPublic {
    switch (users.get(uid)) {
      case (?u) ?userToPublic(u);
      case null null;
    }
  };

  public func updateProfile(
    users : Map.Map<Common.UserId, Types.User>,
    caller : Common.UserId,
    username : Text,
    bio : Text,
    avatarUrl : Text,
  ) : Bool {
    switch (users.get(caller)) {
      case null false;
      case (?u) {
        u.username := username;
        u.bio := bio;
        u.avatarUrl := avatarUrl;
        true
      };
    }
  };

  // ---- Post logic ----

  public func createPost(
    posts : Map.Map<Common.PostId, Types.Post>,
    state : { var nextPostIdx : Nat },
    userId : Common.UserId,
    imageUrl : Text,
    caption : Text,
    now : Common.Timestamp,
  ) : Common.PostId {
    let idx = state.nextPostIdx;
    state.nextPostIdx += 1;
    let postId = userId.toText() # "-" # idx.toText();
    let post : Types.Post = {
      postId;
      userId;
      var imageUrl;
      var caption;
      var likesCount = 0;
      var commentsCount = 0;
      createdAt = now;
    };
    posts.add(postId, post);
    postId
  };

  public func getPost(
    posts : Map.Map<Common.PostId, Types.Post>,
    postId : Common.PostId,
  ) : ?Types.PostPublic {
    switch (posts.get(postId)) {
      case (?p) ?postToPublic(p);
      case null null;
    }
  };

  public func getFeed(
    posts : Map.Map<Common.PostId, Types.Post>,
    offset : Nat,
    limit : Nat,
  ) : Types.FeedPage {
    // Collect all posts, sort by createdAt descending
    let iter = posts.values();
    let arr = iter.toArray();
    let sorted = arr.sort(func(a, b) {
      Int.compare(b.createdAt, a.createdAt)
    });
    let total = sorted.size();
    if (offset >= total) {
      return { posts = []; nextOffset = null };
    };
    let end : Int = if (offset + limit > total) total else offset + limit;
    let page = sorted.sliceToArray(offset, end);
    let publicPosts = page.map(func(p) { postToPublic(p) });
    let nextOffset : ?Nat = if (end.toNat() < total) ?(end.toNat()) else null;
    { posts = publicPosts; nextOffset }
  };

  // ---- Like logic ----

  public func likePost(
    likes : Set.Set<Text>,
    posts : Map.Map<Common.PostId, Types.Post>,
    userId : Common.UserId,
    postId : Common.PostId,
  ) : Bool {
    let key = likeKey(userId, postId);
    if (likes.contains(key)) {
      return false; // already liked
    };
    likes.add(key);
    switch (posts.get(postId)) {
      case (?p) { p.likesCount += 1 };
      case null {};
    };
    true
  };

  public func unlikePost(
    likes : Set.Set<Text>,
    posts : Map.Map<Common.PostId, Types.Post>,
    userId : Common.UserId,
    postId : Common.PostId,
  ) : Bool {
    let key = likeKey(userId, postId);
    if (not likes.contains(key)) {
      return false; // not liked
    };
    likes.remove(key);
    switch (posts.get(postId)) {
      case (?p) {
        if (p.likesCount > 0) { p.likesCount -= 1 }
      };
      case null {};
    };
    true
  };

  // ---- Save logic ----

  public func savePost(
    savedPosts : Map.Map<Text, Types.SavedPost>,
    userId : Common.UserId,
    postId : Common.PostId,
    now : Common.Timestamp,
  ) : Bool {
    let key = savedKey(userId, postId);
    if (savedPosts.containsKey(key)) {
      return false;
    };
    savedPosts.add(key, { userId; postId; savedAt = now });
    true
  };

  public func unsavePost(
    savedPosts : Map.Map<Text, Types.SavedPost>,
    userId : Common.UserId,
    postId : Common.PostId,
  ) : Bool {
    let key = savedKey(userId, postId);
    if (not savedPosts.containsKey(key)) {
      return false;
    };
    savedPosts.remove(key);
    true
  };

  // ---- Comment logic ----

  public func addComment(
    comments : List.List<Types.Comment>,
    state : { var nextCommentIdx : Nat },
    postId : Common.PostId,
    userId : Common.UserId,
    posts : Map.Map<Common.PostId, Types.Post>,
    text : Text,
    now : Common.Timestamp,
  ) : Common.CommentId {
    let idx = state.nextCommentIdx;
    state.nextCommentIdx += 1;
    let commentId = userId.toText() # "-c-" # idx.toText();
    let comment : Types.Comment = {
      commentId;
      postId;
      userId;
      var text;
      createdAt = now;
    };
    comments.add(comment);
    switch (posts.get(postId)) {
      case (?p) { p.commentsCount += 1 };
      case null {};
    };
    commentId
  };

  public func getComments(
    comments : List.List<Types.Comment>,
    postId : Common.PostId,
  ) : [Types.CommentPublic] {
    let filtered = comments.filter(func(c) { c.postId == postId });
    let mapped = filtered.map<Types.Comment, Types.CommentPublic>(func(c) { commentToPublic(c) });
    mapped.toArray<Types.CommentPublic>()
  };

  // ---- Follow logic ----

  public func followUser(
    follows : Set.Set<Text>,
    users : Map.Map<Common.UserId, Types.User>,
    followerId : Common.UserId,
    followeeId : Common.UserId,
  ) : Bool {
    if (followerId == followeeId) return false;
    let key = followKey(followerId, followeeId);
    if (follows.contains(key)) {
      return false;
    };
    follows.add(key);
    switch (users.get(followerId)) {
      case (?u) { u.followingCount += 1 };
      case null {};
    };
    switch (users.get(followeeId)) {
      case (?u) { u.followersCount += 1 };
      case null {};
    };
    true
  };

  public func unfollowUser(
    follows : Set.Set<Text>,
    users : Map.Map<Common.UserId, Types.User>,
    followerId : Common.UserId,
    followeeId : Common.UserId,
  ) : Bool {
    let key = followKey(followerId, followeeId);
    if (not follows.contains(key)) {
      return false;
    };
    follows.remove(key);
    switch (users.get(followerId)) {
      case (?u) { if (u.followingCount > 0) u.followingCount -= 1 };
      case null {};
    };
    switch (users.get(followeeId)) {
      case (?u) { if (u.followersCount > 0) u.followersCount -= 1 };
      case null {};
    };
    true
  };

  // ---- Notification logic ----

  public func addNotification(
    notifications : Map.Map<Common.NotifId, Types.Notification>,
    state : { var nextNotifIdx : Nat },
    userId : Common.UserId,
    actorId : Common.UserId,
    notifType : Text,
    postId : ?Common.PostId,
    now : Common.Timestamp,
  ) : () {
    let idx = state.nextNotifIdx;
    state.nextNotifIdx += 1;
    let notifId = userId.toText() # "-n-" # idx.toText();
    let notif : Types.Notification = {
      notifId;
      userId;
      actorId;
      notifType;
      postId;
      createdAt = now;
    };
    notifications.add(notifId, notif);
  };

  public func getNotifications(
    notifications : Map.Map<Common.NotifId, Types.Notification>,
    userId : Common.UserId,
  ) : [Types.Notification] {
    let arr = notifications.values().toArray();
    arr.filter<Types.Notification>(func(n) { Principal.equal(n.userId, userId) })
  };
};
