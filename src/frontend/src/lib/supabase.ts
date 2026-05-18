import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qlkipgcbnyyiqagstrrm.supabase.co";
const SUPABASE_KEY = "sb_publishable_i1PfW23rimOkFCja5N2o-w_8ITzxJzX";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Post = {
  id: string;
  user_id: string;
  username: string;
  caption: string;
  image_url: string;
  location: string;
  likes: number;
  created_at: string;
};

export type Story = {
  id: string;
  user_id: string;
  username: string;
  media_url: string;
  caption: string;
  tagged_users: string[];
  expires_at: string;
  created_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
};

export type Profile = {
  id: string;
  username: string;
  bio: string;
  avatar_url: string;
  created_at: string;
};

export type Follow = {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
};
