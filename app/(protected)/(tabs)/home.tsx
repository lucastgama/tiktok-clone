import VideoThumbnailItem from "@/components/ui/videoThumbnailItem";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/expo";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, View, StyleSheet } from "react-native";

export default function HomeScreen() {
  const { user } = useUser();
  const [videoList, setVideoList] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    syncUser();
    getAllVideos();
  }, [user?.id]);

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

  const getAllVideos = async () => {
    const { data, error } = await supabase
      .from("PostLists")
      .select(`*, userId:Users (profileImage, username)`)
      .order("created_at", { ascending: false });

    if (error) return;

    setVideoList(data || []);
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
        renderItem={({ item }) => <VideoThumbnailItem video={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
});
