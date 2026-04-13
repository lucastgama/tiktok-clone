import VideoThumbnailItem from "@/components/ui/videoThumbnailItem";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/expo";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const PAGE_SIZE = 8;

export default function HomeScreen() {
  const { user } = useUser();
  const [videoList, setVideoList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadCounter, setLoadCounter] = useState<number>(0);

  useEffect(() => {
    if (!user?.id) return;

    syncUser();
    getAllVideos(true);
  }, [user?.id]);

  useEffect(() => {
    if (loadCounter === 0) return;
    getAllVideos();
  }, [loadCounter]);

  const syncUser = async () => {
    const { data: existingUser } = await supabase
      .from("Users")
      .select("id")
      .eq("clerk_id", user?.id)
      .maybeSingle();

    if (!existingUser) {
      await supabase.from("Users").insert({
        clerk_id: user?.id,
        email: user?.primaryEmailAddress?.emailAddress,
        name: user?.firstName,
        username: user?.primaryEmailAddress?.emailAddress?.split("@")[0],
        profileImage: user?.imageUrl,
      });
    }
  };

  const getAllVideos = async (reset = false) => {
    setLoading(true);

    const from = reset ? 0 : loadCounter;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("PostLists")
      .select(`*, userId:Users (profileImage, username)`)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      setLoading(false);
      return;
    }

    const nextVideos = (data as any[]) ?? [];

    const sortedVideos = [...nextVideos].sort((firstVideo, secondVideo) => {
      const firstIsCurrentUser = firstVideo?.clerkId === user?.id ? 1 : 0;
      const secondIsCurrentUser = secondVideo?.clerkId === user?.id ? 1 : 0;

      if (firstIsCurrentUser !== secondIsCurrentUser) {
        return secondIsCurrentUser - firstIsCurrentUser;
      }

      return 0;
    });

    setVideoList((currentVideos) => {
      if (reset) {
        return sortedVideos;
      }

      const mergedVideos = [...currentVideos, ...sortedVideos];
      return mergedVideos.filter(
        (video, index, array) =>
          array.findIndex((item) => item?.id === video?.id) === index,
      );
    });
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TikTok Clone</Text>
        <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
      </View>

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
        onRefresh={() => {
          setLoadCounter(0);
          getAllVideos(true);
        }}
        refreshing={loading}
        onEndReached={() => setLoadCounter((prev) => prev + PAGE_SIZE)}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nenhum vídeo encontrado</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    lineHeight: 20,
  },
});
