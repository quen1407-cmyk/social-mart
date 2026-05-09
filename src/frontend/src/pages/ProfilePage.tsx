import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import {
  useFollowUser,
  useGetMyProfile,
  useGetUser,
  useUnfollowUser,
  useUpdateProfile,
} from "@/hooks/useQueries";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Camera,
  Grid3x3,
  Settings,
  ShoppingBag,
  UserCheck,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const SAMPLE_POSTS = [
  { postId: "p1", image: "/assets/generated/profile-grid-1.dim_600x600.jpg" },
  { postId: "p2", image: "/assets/generated/profile-grid-2.dim_600x600.jpg" },
  { postId: "p3", image: "/assets/generated/hero-feed-1.dim_800x800.jpg" },
  { postId: "p4", image: "/assets/generated/hero-feed-2.dim_800x800.jpg" },
  { postId: "p5", image: "/assets/generated/hero-feed-3.dim_800x800.jpg" },
  { postId: "p6", image: "/assets/generated/profile-grid-1.dim_600x600.jpg" },
];

function ProfileSkeleton() {
  return (
    <div>
      <div className="px-5 pt-5 pb-4 bg-card border-b border-border">
        <div className="flex items-start gap-5">
          <Skeleton className="h-20 w-20 rounded-full shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-36 rounded-lg" />
            <Skeleton className="h-3.5 w-52 rounded-md" />
            <Skeleton className="h-3 w-44 rounded-md" />
            <div className="flex gap-5 mt-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-8 rounded-md" />
                  <Skeleton className="h-3 w-12 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Skeleton className="h-10 w-full rounded-xl mt-4" />
      </div>
      <div className="flex bg-card border-b border-border">
        <Skeleton className="h-10 flex-1 m-2 rounded-lg" />
        <Skeleton className="h-10 flex-1 m-2 rounded-lg" />
      </div>
      <div className="grid grid-cols-3 gap-0.5 bg-border">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-none" />
        ))}
      </div>
    </div>
  );
}

function EditProfileSheet({
  open,
  onClose,
  initialUsername,
  initialBio,
  initialAvatarUrl,
}: {
  open: boolean;
  onClose: () => void;
  initialUsername: string;
  initialBio: string;
  initialAvatarUrl: string;
}) {
  const [username, setUsername] = useState(initialUsername);
  const [bio, setBio] = useState(initialBio);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const updateProfile = useUpdateProfile();

  useEffect(() => {
    if (open) {
      setUsername(initialUsername);
      setBio(initialBio);
      setAvatarUrl(initialAvatarUrl);
    }
  }, [open, initialUsername, initialBio, initialAvatarUrl]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({ username, bio, avatarUrl });
      toast.success("Profile updated!");
      onClose();
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        data-ocid="profile.edit_sheet"
        className="bg-card border-border rounded-t-3xl max-h-[90svh] overflow-y-auto px-0"
      >
        <SheetHeader className="px-5 pb-0">
          <SheetTitle className="font-display text-lg">Edit Profile</SheetTitle>
        </SheetHeader>

        {/* Avatar preview + URL */}
        <div className="flex flex-col items-center gap-3 py-5 px-5 border-b border-border">
          <div className="relative">
            <Avatar
              src={
                avatarUrl ||
                `https://api.dicebear.com/9.x/notionists/svg?seed=${username}`
              }
              alt={username || "User"}
              size="xl"
              withRing
            />
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary flex items-center justify-center">
              <Camera size={13} className="text-primary-foreground" />
            </div>
          </div>
          <div className="w-full">
            <label
              htmlFor="edit-avatar-url"
              className="text-xs text-muted-foreground font-medium"
            >
              Avatar URL
            </label>
            <input
              id="edit-avatar-url"
              data-ocid="profile.edit_avatar_input"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="mt-1 w-full h-10 rounded-xl bg-muted border border-input px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            />
          </div>
        </div>

        {/* Fields */}
        <div className="px-5 py-4 space-y-4">
          <div>
            <label
              htmlFor="edit-username"
              className="text-xs text-muted-foreground font-medium"
            >
              Username
            </label>
            <input
              id="edit-username"
              data-ocid="profile.edit_username_input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              maxLength={32}
              className="mt-1 w-full h-10 rounded-xl bg-muted border border-input px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            />
          </div>
          <div>
            <label
              htmlFor="edit-bio"
              className="text-xs text-muted-foreground font-medium"
            >
              Bio
            </label>
            <textarea
              id="edit-bio"
              data-ocid="profile.edit_bio_textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your story..."
              maxLength={160}
              rows={3}
              className="mt-1 w-full rounded-xl bg-muted border border-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none"
            />
            <p className="text-right text-[10px] text-muted-foreground mt-1">
              {bio.length}/160
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-8 flex gap-3">
          <button
            type="button"
            data-ocid="profile.edit_cancel_button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-smooth"
          >
            Cancel
          </button>
          <button
            type="button"
            data-ocid="profile.edit_save_button"
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-smooth hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {updateProfile.isPending ? (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-label="Saving"
                role="img"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function ProfilePage() {
  const { uid } = useParams({ strict: false }) as { uid: string };
  const { isAuthenticated, principal } = useAuth();
  const navigate = useNavigate();

  const isSelf =
    uid === "me" || (principal != null && uid === principal.toText());

  const {
    data: myProfile,
    isLoading: myLoading,
    isError: myError,
  } = useGetMyProfile();

  const {
    data: otherProfile,
    isLoading: otherLoading,
    isError: otherError,
  } = useGetUser(isSelf ? undefined : uid);

  const profile = isSelf ? myProfile : otherProfile;
  const isLoading = isSelf ? myLoading : otherLoading;
  const isError = isSelf ? myError : otherError;

  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const [tab, setTab] = useState<"posts" | "products">("posts");
  const [editOpen, setEditOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const followPending = followUser.isPending || unfollowUser.isPending;
  const prevUid = useRef(uid);

  useEffect(() => {
    if (prevUid.current !== uid) {
      setFollowing(false);
      prevUid.current = uid;
    }
  }, [uid]);

  const handleFollowToggle = async () => {
    if (!uid) return;
    try {
      if (following) {
        await unfollowUser.mutateAsync(uid);
        setFollowing(false);
        toast("Unfollowed");
      } else {
        await followUser.mutateAsync(uid);
        setFollowing(true);
        toast("Now following!");
      }
    } catch {
      toast.error("Action failed. Please try again.");
    }
  };

  // Unauthenticated own-profile guard
  if (!isAuthenticated && isSelf) {
    return (
      <Layout>
        <div
          data-ocid="profile.auth_required"
          className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-6"
        >
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
            <UserPlus size={28} className="text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-display font-bold text-lg text-foreground">
              Sign in to view your profile
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Create an account or sign in to get started
            </p>
          </div>
          <button
            type="button"
            data-ocid="profile.login_button"
            onClick={() => navigate({ to: "/auth/login" })}
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-smooth hover:opacity-90 active:scale-95"
          >
            Sign In
          </button>
        </div>
      </Layout>
    );
  }

  const displayName = profile?.username ?? (isSelf ? "New User" : "User");
  const avatarSrc =
    profile?.avatarUrl ??
    `https://api.dicebear.com/9.x/notionists/svg?seed=${uid}`;

  return (
    <Layout>
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="text-base font-display font-bold text-foreground truncate">
          {displayName}
        </span>
        {isSelf && (
          <button
            type="button"
            data-ocid="profile.settings_button"
            onClick={() => toast("Settings coming soon")}
            className="p-2 rounded-full hover:bg-muted transition-smooth"
            aria-label="Settings"
          >
            <Settings
              size={20}
              strokeWidth={1.75}
              className="text-foreground"
            />
          </button>
        )}
      </header>

      {/* Loading skeleton */}
      {isLoading && <ProfileSkeleton />}

      {/* Error state */}
      {!isLoading && (isError || (!profile && !isLoading)) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          data-ocid="profile.error_state"
          className="flex flex-col items-center justify-center min-h-[50vh] gap-5 px-6"
        >
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <UserMinus size={32} className="text-muted-foreground/50" />
          </div>
          <div className="text-center">
            <p className="font-display font-bold text-lg text-foreground">
              User not found
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              This account may not exist or was removed
            </p>
          </div>
          <button
            type="button"
            data-ocid="profile.back_button"
            onClick={() => navigate({ to: "/" })}
            className="px-6 py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-smooth"
          >
            Go Home
          </button>
        </motion.div>
      )}

      {/* Profile content */}
      {!isLoading && profile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Profile header card */}
          <div className="px-5 pt-5 pb-4 bg-card border-b border-border">
            <div className="flex items-start gap-5">
              <Avatar src={avatarSrc} alt={displayName} size="xl" withRing />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-display font-bold text-foreground truncate">
                  {displayName}
                </h2>
                {profile.bio ? (
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground/50 mt-0.5 italic">
                    {isSelf ? "Add a bio to tell your story" : "No bio yet"}
                  </p>
                )}

                {/* Stats row */}
                <div className="flex gap-5 mt-3">
                  {[
                    {
                      label: "Posts",
                      value: 0,
                      ocid: "profile.posts_count",
                    },
                    {
                      label: "Followers",
                      value: Number(profile.followersCount),
                      ocid: "profile.followers_count",
                    },
                    {
                      label: "Following",
                      value: Number(profile.followingCount),
                      ocid: "profile.following_count",
                    },
                  ].map(({ label, value, ocid }) => (
                    <div key={label} className="text-center" data-ocid={ocid}>
                      <p className="font-display font-bold text-sm text-foreground">
                        {value >= 1000
                          ? `${(value / 1000).toFixed(1)}k`
                          : value}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-4">
              {isSelf ? (
                <button
                  type="button"
                  data-ocid="profile.edit_button"
                  onClick={() => setEditOpen(true)}
                  className="w-full h-10 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-smooth active:scale-[0.98]"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  data-ocid="profile.follow_button"
                  onClick={handleFollowToggle}
                  disabled={followPending}
                  className={`w-full h-10 rounded-xl text-sm font-semibold transition-smooth flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 ${
                    following
                      ? "border border-border text-foreground hover:bg-muted"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {following ? (
                    <>
                      <UserCheck size={15} />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={15} />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Tab selector */}
          <div
            className="flex bg-card border-b border-border"
            data-ocid="profile.tabs"
          >
            {(["posts", "products"] as const).map((t) => (
              <button
                type="button"
                key={t}
                data-ocid={`profile.${t}_tab`}
                onClick={() => setTab(t)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-smooth border-b-2 ${
                  tab === t
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "posts" ? (
                  <Grid3x3 size={16} />
                ) : (
                  <ShoppingBag size={16} />
                )}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          {tab === "posts" && (
            <div className="grid grid-cols-3 gap-0.5 bg-border">
              {SAMPLE_POSTS.map(({ postId, image }, idx) => (
                <motion.button
                  type="button"
                  key={postId}
                  data-ocid={`profile.post.${idx + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  onClick={() =>
                    navigate({ to: "/post/$postId", params: { postId } })
                  }
                  className="aspect-square bg-muted overflow-hidden block"
                  aria-label={`View post ${idx + 1}`}
                >
                  <img
                    src={image}
                    alt={`Post ${idx + 1}`}
                    className="h-full w-full object-cover transition-smooth hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/images/placeholder.svg";
                    }}
                  />
                </motion.button>
              ))}
            </div>
          )}

          {/* Products empty state */}
          {tab === "products" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              data-ocid="profile.products.empty_state"
              className="flex flex-col items-center justify-center py-16 gap-4 px-6"
            >
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                <ShoppingBag size={28} className="text-muted-foreground/50" />
              </div>
              <div className="text-center">
                <p className="font-display font-semibold text-foreground">
                  No products listed yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isSelf
                    ? "Start selling by uploading your first product"
                    : "This user has no products for sale"}
                </p>
              </div>
              {isSelf && (
                <button
                  type="button"
                  data-ocid="profile.add_product_button"
                  onClick={() => navigate({ to: "/upload" })}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-smooth hover:opacity-90 active:scale-95"
                >
                  List a Product
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Edit Profile Sheet */}
      {isSelf && (
        <EditProfileSheet
          open={editOpen}
          onClose={() => setEditOpen(false)}
          initialUsername={profile?.username ?? ""}
          initialBio={profile?.bio ?? ""}
          initialAvatarUrl={profile?.avatarUrl ?? ""}
        />
      )}
    </Layout>
  );
}
