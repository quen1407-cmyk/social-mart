import type { backendInterface } from "../backend";

const mockUserId = { toText: () => "mock-user-1", toString: () => "mock-user-1" } as any;
const mockUserId2 = { toText: () => "mock-user-2", toString: () => "mock-user-2" } as any;

const samplePosts = [
  {
    postId: "post-1",
    userId: mockUserId,
    imageUrl: "https://picsum.photos/seed/post1/600/600",
    caption: "Beautiful sunset at the beach 🌅 #nature #photography",
    likesCount: BigInt(142),
    commentsCount: BigInt(18),
    createdAt: BigInt(Date.now() * 1_000_000),
  },
  {
    postId: "post-2",
    userId: mockUserId2,
    imageUrl: "https://picsum.photos/seed/post2/600/600",
    caption: "Check out this amazing product I found! Limited edition sneakers 👟 #fashion",
    likesCount: BigInt(87),
    commentsCount: BigInt(24),
    createdAt: BigInt((Date.now() - 3600000) * 1_000_000),
  },
  {
    postId: "post-3",
    userId: mockUserId,
    imageUrl: "https://picsum.photos/seed/post3/600/600",
    caption: "New collection drop! Handmade ceramic mugs available now 🍵 #handmade #pottery",
    likesCount: BigInt(234),
    commentsCount: BigInt(41),
    createdAt: BigInt((Date.now() - 7200000) * 1_000_000),
  },
];

export const mockBackend: backendInterface = {
  addComment: async (_postId, _text) => "comment-1",

  createPost: async (_imageUrl, _caption) => "post-new",

  followUser: async (_followeeId) => true,

  getComments: async (_postId) => [
    {
      commentId: "c1",
      userId: mockUserId2,
      postId: "post-1",
      text: "Absolutely stunning! 😍",
      createdAt: BigInt(Date.now() * 1_000_000),
    },
    {
      commentId: "c2",
      userId: mockUserId,
      postId: "post-1",
      text: "Where is this location? I want to visit!",
      createdAt: BigInt((Date.now() - 1800000) * 1_000_000),
    },
  ],

  getFeed: async (_offset, _limit) => ({
    posts: samplePosts,
    nextOffset: BigInt(3),
  }),

  getMyProfile: async () => ({
    uid: mockUserId,
    username: "social_mart_user",
    email: "user@example.com",
    bio: "✨ Creator & Seller | Shop my store below 🛍️",
    avatarUrl: "https://picsum.photos/seed/avatar1/200/200",
    followersCount: BigInt(1240),
    followingCount: BigInt(380),
  }),

  getNotifications: async () => [
    {
      notifId: "n1",
      notifType: "like",
      userId: mockUserId,
      actorId: mockUserId2,
      postId: "post-1",
      createdAt: BigInt(Date.now() * 1_000_000),
    },
    {
      notifId: "n2",
      notifType: "follow",
      userId: mockUserId,
      actorId: mockUserId2,
      createdAt: BigInt((Date.now() - 3600000) * 1_000_000),
    },
    {
      notifId: "n3",
      notifType: "comment",
      userId: mockUserId,
      actorId: mockUserId2,
      postId: "post-2",
      createdAt: BigInt((Date.now() - 7200000) * 1_000_000),
    },
  ],

  getPost: async (_postId) => samplePosts[0],

  getUser: async (_uid) => ({
    uid: mockUserId2,
    username: "trendy_seller",
    email: "seller@example.com",
    bio: "💼 Online seller | Fast delivery | DM for custom orders",
    avatarUrl: "https://picsum.photos/seed/avatar2/200/200",
    followersCount: BigInt(3560),
    followingCount: BigInt(210),
  }),

  likePost: async (_postId) => true,

  registerUser: async (_username, _email) => true,

  savePost: async (_postId) => true,

  unfollowUser: async (_followeeId) => true,

  unlikePost: async (_postId) => true,

  unsavePost: async (_postId) => true,

  updateProfile: async (_username, _bio, _avatarUrl) => true,
};
