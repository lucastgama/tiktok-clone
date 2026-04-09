import VideoThumbnailItem from "@/components/ui/videoThumbnailItem";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/expo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const { user } = useUser();
  const [videoList, setVideoList] = useState<any[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    fetchUserVideos();
  }, [user?.id]);

  const fetchUserVideos = async () => {
    setLoading(true);

    const { data: supabaseUser } = await supabase
      .from("Users")
      .select("id")
      .eq("clerk_id", user?.id)
      .maybeSingle();

    if (!supabaseUser) {
      setLoading(false);
      return;
    }

    const { data: videos } = await supabase
      .from("PostLists")
      .select(`*, userId:Users (profileImage, username)`)
      .eq("clerkId", user?.id)
      .order("created_at", { ascending: false });

    setVideoList(videos ?? []);

    if (videos && videos.length > 0) {
      const videoIds = videos.map((v: any) => v.id);
      const { count } = await supabase
        .from("VideoLikes")
        .select("id", { count: "exact", head: true })
        .in("postIdRef", videoIds);
      setTotalLikes(count ?? 0);
    } else {
      setTotalLikes(0);
    }

    setLoading(false);
  };

  const formatCount = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  };

  const username =
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ??
    user?.firstName ??
    "User";

  return (
    <FlatList
      data={videoList}
      numColumns={2}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={({ item, index }) => (
        <VideoThumbnailItem
          video={item}
          videoList={videoList}
          videoIndex={index}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      onRefresh={fetchUserVideos}
      refreshing={loading}
      ListHeaderComponent={
        <View style={styles.header}>
          <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
          <Text style={styles.username}>{username}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <FontAwesome
                name="video-camera"
                size={14}
                style={styles.heartIcon}
              />
              <Text style={styles.statNumber}>
                {formatCount(videoList.length)} Videos
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <FontAwesome name="heart" size={14} style={styles.heartIcon} />
              <Text style={styles.statNumber}>
                {formatCount(totalLikes)} Likes
              </Text>
            </View>
          </View>
        </View>
      }
      ListEmptyComponent={
        !loading ? (
          <View style={styles.empty}>
            <FontAwesome name="video-camera" size={40} color="#ccc" />
            <Text style={styles.emptyText}>No videos yet</Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    backgroundColor: "#fff",
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#ff2d55",
  },
  username: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 32,
  },
  statItem: {
    alignItems: "center",
    minWidth: 70,
  },
  heartIcon: {
    marginBottom: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#eee",
  },
  empty: {
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: "#aaa",
  },
});
