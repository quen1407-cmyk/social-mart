import { createActor } from "@/backend";
import type {
  CommentPublic,
  FeedPage,
  Notification,
  PostPublic,
  UserPublic,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useAct() {
  return useActor(createActor);
}

export function useGetFeed(offset = 0n, limit = 10n) {
  const { actor, isFetching } = useAct();
  return useQuery<FeedPage>({
    queryKey: ["feed", offset.toString(), limit.toString()],
    queryFn: async () => {
      if (!actor) return { posts: [] };
      return actor.getFeed(offset, limit);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPost(postId: string) {
  const { actor, isFetching } = useAct();
  return useQuery<PostPublic | null>({
    queryKey: ["post", postId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPost(postId);
    },
    enabled: !!actor && !isFetching && !!postId,
  });
}

export function useGetUser(uid: string | undefined) {
  const { actor, isFetching } = useAct();
  return useQuery<UserPublic | null>({
    queryKey: ["user", uid],
    queryFn: async () => {
      if (!actor || !uid) return null;
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.getUser(Principal.fromText(uid));
    },
    enabled: !!actor && !isFetching && !!uid,
  });
}

export function useGetMyProfile() {
  const { actor, isFetching } = useAct();
  return useQuery<UserPublic | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetComments(postId: string) {
  const { actor, isFetching } = useAct();
  return useQuery<CommentPublic[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComments(postId);
    },
    enabled: !!actor && !isFetching && !!postId,
  });
}

export function useGetNotifications() {
  const { actor, isFetching } = useAct();
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLikePost() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error("No actor");
      return actor.likePost(postId);
    },
    onSuccess: (_, postId) => {
      qc.invalidateQueries({ queryKey: ["post", postId] });
      qc.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}

export function useUnlikePost() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error("No actor");
      return actor.unlikePost(postId);
    },
    onSuccess: (_, postId) => {
      qc.invalidateQueries({ queryKey: ["post", postId] });
      qc.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}

export function useSavePost() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error("No actor");
      return actor.savePost(postId);
    },
    onSuccess: (_, postId) => {
      qc.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}

export function useAddComment() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, text }: { postId: string; text: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.addComment(postId, text);
    },
    onSuccess: (_, { postId }) => {
      qc.invalidateQueries({ queryKey: ["comments", postId] });
      qc.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}

export function useCreatePost() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      imageUrl,
      caption,
    }: { imageUrl: string; caption: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createPost(imageUrl, caption);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      bio,
      avatarUrl,
    }: { username: string; bio: string; avatarUrl: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProfile(username, bio, avatarUrl);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useRegisterUser() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      email,
    }: { username: string; email: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.registerUser(username, email);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useFollowUser() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (uid: string) => {
      if (!actor) throw new Error("No actor");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.followUser(Principal.fromText(uid));
    },
    onSuccess: (_, uid) => {
      qc.invalidateQueries({ queryKey: ["user", uid] });
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useUnfollowUser() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (uid: string) => {
      if (!actor) throw new Error("No actor");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.unfollowUser(Principal.fromText(uid));
    },
    onSuccess: (_, uid) => {
      qc.invalidateQueries({ queryKey: ["user", uid] });
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}
