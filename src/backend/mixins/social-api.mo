// Public API mixin for Social Mart social domain
import Types "../types/social";
import Common "../types/common";
import SocialLib "../lib/social";
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

mixin (
  users : Map.Map<Common.UserId, Types.User>,
  posts : Map.Map<Common.PostId, Types.Post>,
  comments : List.List<Types.Comment>,
  likes : Set.Set<Text>,
  savedPosts : Map.Map<Text, Types.SavedPost>,
  follows : Set.Set<Text>,
  notifications : Map.Map<Common.NotifId, Types.Notification>,
  state : {
    var nextPostIdx : Nat;
    var nextCommentIdx : Nat;
    var nextNotifIdx : Nat;
  },
) {

  // ---- Authentication / Profile ----

  public shared ({ caller }) func registerUser(username : Text, email : Text) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    SocialLib.registerUser(users, caller, username, email)
  };

  public shared query ({ caller }) func getMyProfile() : async ?Types.UserPublic {
    SocialLib.getUser(users, caller)
  };

  public shared ({ caller }) func updateProfile(username : Text, bio : Text, avatarUrl : Text) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    SocialLib.updateProfile(users, caller, username, bio, avatarUrl)
  };

  public shared query func getUser(uid : Common.UserId) : async ?Types.UserPublic {
    SocialLib.getUser(users, uid)
  };

  // ---- Posts ----

  public shared ({ caller }) func createPost(imageUrl : Text, caption : Text) : async Common.PostId {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    SocialLib.createPost(posts, state, caller, imageUrl, caption, Time.now())
  };

  public shared query func getPost(postId : Common.PostId) : async ?Types.PostPublic {
    SocialLib.getPost(posts, postId)
  };

  public shared query func getFeed(offset : Nat, limit : Nat) : async Types.FeedPage {
    SocialLib.getFeed(posts, offset, limit)
  };

  // ---- Likes ----

  public shared ({ caller }) func likePost(postId : Common.PostId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    let liked = SocialLib.likePost(likes, posts, caller, postId);
    if (liked) {
      switch (posts.get(postId)) {
        case (?p) {
          if (not Principal.equal(p.userId, caller)) {
            SocialLib.addNotification(notifications, state, p.userId, caller, "like", ?postId, Time.now());
          };
        };
        case null {};
      };
    };
    liked
  };

  public shared ({ caller }) func unlikePost(postId : Common.PostId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    SocialLib.unlikePost(likes, posts, caller, postId)
  };

  // ---- Saved Posts ----

  public shared ({ caller }) func savePost(postId : Common.PostId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    SocialLib.savePost(savedPosts, caller, postId, Time.now())
  };

  public shared ({ caller }) func unsavePost(postId : Common.PostId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    SocialLib.unsavePost(savedPosts, caller, postId)
  };

  // ---- Comments ----

  public shared ({ caller }) func addComment(postId : Common.PostId, text : Text) : async Common.CommentId {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    let commentId = SocialLib.addComment(comments, state, postId, caller, posts, text, Time.now());
    switch (posts.get(postId)) {
      case (?p) {
        if (not Principal.equal(p.userId, caller)) {
          SocialLib.addNotification(notifications, state, p.userId, caller, "comment", ?postId, Time.now());
        };
      };
      case null {};
    };
    commentId
  };

  public shared query func getComments(postId : Common.PostId) : async [Types.CommentPublic] {
    SocialLib.getComments(comments, postId)
  };

  // ---- Follows ----

  public shared ({ caller }) func followUser(followeeId : Common.UserId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    let followed = SocialLib.followUser(follows, users, caller, followeeId);
    if (followed) {
      SocialLib.addNotification(notifications, state, followeeId, caller, "follow", null, Time.now());
    };
    followed
  };

  public shared ({ caller }) func unfollowUser(followeeId : Common.UserId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers not allowed");
    SocialLib.unfollowUser(follows, users, caller, followeeId)
  };

  // ---- Notifications ----

  public shared query ({ caller }) func getNotifications() : async [Types.Notification] {
    SocialLib.getNotifications(notifications, caller)
  };
};
