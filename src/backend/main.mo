// Social Mart — composition root
import Types "types/social";
import Common "types/common";
import SocialMixin "mixins/social-api";
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";

actor {
  // ---- Stable state ----
  let users = Map.empty<Common.UserId, Types.User>();
  let posts = Map.empty<Common.PostId, Types.Post>();
  let comments = List.empty<Types.Comment>();
  let likes = Set.empty<Text>();
  let savedPosts = Map.empty<Text, Types.SavedPost>();
  let follows = Set.empty<Text>();
  let notifications = Map.empty<Common.NotifId, Types.Notification>();
  let state = { var nextPostIdx = 0; var nextCommentIdx = 0; var nextNotifIdx = 0 };

  // ---- Mixin composition ----
  include SocialMixin(users, posts, comments, likes, savedPosts, follows, notifications, state);
};
