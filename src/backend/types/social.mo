// Social domain types: users, posts, comments, likes, follows, saves, notifications
import Common "common";

module {
  // ---- User ----
  public type User = {
    uid : Common.UserId;
    var username : Text;
    var email : Text;
    var bio : Text;
    var avatarUrl : Text;
    var followersCount : Nat;
    var followingCount : Nat;
  };

  public type UserPublic = {
    uid : Common.UserId;
    username : Text;
    email : Text;
    bio : Text;
    avatarUrl : Text;
    followersCount : Nat;
    followingCount : Nat;
  };

  // ---- Post ----
  public type Post = {
    postId : Common.PostId;
    userId : Common.UserId;
    var imageUrl : Text;
    var caption : Text;
    var likesCount : Nat;
    var commentsCount : Nat;
    createdAt : Common.Timestamp;
  };

  public type PostPublic = {
    postId : Common.PostId;
    userId : Common.UserId;
    imageUrl : Text;
    caption : Text;
    likesCount : Nat;
    commentsCount : Nat;
    createdAt : Common.Timestamp;
  };

  // ---- Comment ----
  public type Comment = {
    commentId : Common.CommentId;
    postId : Common.PostId;
    userId : Common.UserId;
    var text : Text;
    createdAt : Common.Timestamp;
  };

  public type CommentPublic = {
    commentId : Common.CommentId;
    postId : Common.PostId;
    userId : Common.UserId;
    text : Text;
    createdAt : Common.Timestamp;
  };

  // ---- Like (composite key: userId + postId) ----
  public type LikeKey = { userId : Common.UserId; postId : Common.PostId };

  // ---- SavedPost ----
  public type SavedPost = {
    userId : Common.UserId;
    postId : Common.PostId;
    savedAt : Common.Timestamp;
  };

  // ---- Follow ----
  public type Follow = {
    followerId : Common.UserId;
    followeeId : Common.UserId;
  };

  // ---- Notification ----
  public type Notification = {
    notifId : Common.NotifId;
    userId : Common.UserId;
    actorId : Common.UserId;
    notifType : Text;
    postId : ?Common.PostId;
    createdAt : Common.Timestamp;
  };

  // ---- Feed pagination ----
  public type FeedPage = {
    posts : [PostPublic];
    nextOffset : ?Nat;
  };
};
