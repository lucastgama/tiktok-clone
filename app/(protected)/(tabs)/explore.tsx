import VideoThumbnailItem from "@/components/ui/videoThumbnailItem";
import { supabase } from "@/lib/supabase";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Tab = "videos" | "users";

export default function ExploreScreen() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("videos");
  const [loading, setLoading] = useState(false);

  const [trendingVideos, setTrendingVideos] = useState<any[]>([]);
  const [videoResults, setVideoResults] = useState<any[]>([]);
  const [userResults, setUserResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("PostLists")
        .select(`*, userId:Users (profileImage, username)`)
        .order("created_at", { ascending: false })
        .limit(20);
      setTrendingVideos(data ?? []);
      setLoading(false);
    };
    fetchTrending();
  }, []);

  const search = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);

    const [{ data: users }, { data: videos }] = await Promise.all([
      supabase
        .from("Users")
        .select("id, username, profileImage")
        .ilike("username", `%${text.trim()}%`)
        .limit(20),
      supabase
        .from("PostLists")
        .select(`*, userId:Users (profileImage, username)`)
        .ilike("description", `%${text.trim()}%`)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    setUserResults(users ?? []);
    setVideoResults(videos ?? []);
    setLoading(false);
  }, []);

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setUserResults([]);
      setVideoResults([]);
    }
  };

  const handleSubmit = () => search(query);

  const isSearching = query.trim().length > 0;

  const renderUserItem = ({ item }: { item: any }) => (
    <View style={styles.userRow}>
      <Image source={{ uri: item.profileImage }} style={styles.userAvatar} />
      <Text style={styles.userUsername}>
        {item.username?.split("@")[0] ?? item.username}
      </Text>
    </View>
  );

  const renderVideoItem = ({ item, index }: { item: any; index: number }) => {
    const list = isSearching ? videoResults : trendingVideos;
    return (
      <VideoThumbnailItem video={item} videoList={list} videoIndex={index} />
    );
  };

  const videoData = isSearching ? videoResults : trendingVideos;

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <FontAwesome
          name="search"
          size={16}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Buscar usuários ou vídeos..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              setUserResults([]);
              setVideoResults([]);
            }}
          >
            <FontAwesome name="times-circle" size={16} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {isSearching && (
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === "videos" && styles.tabActive]}
            onPress={() => setTab("videos")}
          >
            <Text
              style={[styles.tabText, tab === "videos" && styles.tabTextActive]}
            >
              Vídeos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === "users" && styles.tabActive]}
            onPress={() => setTab("users")}
          >
            <Text
              style={[styles.tabText, tab === "users" && styles.tabTextActive]}
            >
              Usuários
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!isSearching && <Text style={styles.sectionTitle}>Em Alta</Text>}

      {loading && (
        <ActivityIndicator size="small" color="#ff2d55" style={styles.loader} />
      )}

      {!loading && (!isSearching || tab === "videos") && (
        <FlatList
          key="videos"
          data={videoData}
          numColumns={2}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderVideoItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            isSearching ? (
              <View style={styles.empty}>
                <FontAwesome name="film" size={36} color="#ccc" />
                <Text style={styles.emptyText}>Nenhum vídeo encontrado</Text>
              </View>
            ) : null
          }
        />
      )}

      {!loading && isSearching && tab === "users" && (
        <FlatList
          key="users"
          data={userResults}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderUserItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <FontAwesome name="user" size={36} color="#ccc" />
              <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: {
    marginRight: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    padding: 0,
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 10,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#ff2d55",
  },
  tabText: {
    fontSize: 15,
    color: "#999",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#ff2d55",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  loader: {
    marginTop: 30,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 30,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#eee",
  },
  userUsername: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
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
