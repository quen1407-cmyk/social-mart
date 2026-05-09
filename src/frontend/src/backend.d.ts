import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export type Timestamp = bigint;
export interface PostPublic {
    userId: UserId;
    createdAt: Timestamp;
    imageUrl: string;
    caption: string;
    commentsCount: bigint;
    likesCount: bigint;
    postId: PostId;
}
export interface UserPublic {
    bio: string;
    uid: UserId;
    username: string;
    followersCount: bigint;
    email: string;
    avatarUrl: string;
    followingCount: bigint;
}
export interface FeedPage {
    nextOffset?: bigint;
    posts: Array<PostPublic>;
}
export type PostId = string;
export interface Notification {
    notifType: string;
    userId: UserId;
    createdAt: Timestamp;
    notifId: NotifId;
    actorId: UserId;
    postId?: PostId;
}
export interface CommentPublic {
    commentId: CommentId;
    userId: UserId;
    createdAt: Timestamp;
    text: string;
    postId: PostId;
}
export type CommentId = string;
export type NotifId = string;
export interface backendInterface {
    addComment(postId: PostId, text: string): Promise<CommentId>;
    createPost(imageUrl: string, caption: string): Promise<PostId>;
    followUser(followeeId: UserId): Promise<boolean>;
    getComments(postId: PostId): Promise<Array<CommentPublic>>;
    getFeed(offset: bigint, limit: bigint): Promise<FeedPage>;
    getMyProfile(): Promise<UserPublic | null>;
    getNotifications(): Promise<Array<Notification>>;
    getPost(postId: PostId): Promise<PostPublic | null>;
    getUser(uid: UserId): Promise<UserPublic | null>;
    likePost(postId: PostId): Promise<boolean>;
    registerUser(username: string, email: string): Promise<boolean>;
    savePost(postId: PostId): Promise<boolean>;
    unfollowUser(followeeId: UserId): Promise<boolean>;
    unlikePost(postId: PostId): Promise<boolean>;
    unsavePost(postId: PostId): Promise<boolean>;
    updateProfile(username: string, bio: string, avatarUrl: string): Promise<boolean>;
}
