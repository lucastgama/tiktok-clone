import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VideoThumbnailItem({
  video,
  videoList,
  videoIndex,
}: any) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: "/play",
          params: {
            videos: JSON.stringify(videoList ?? [video]),
            initialIndex: videoIndex ?? 0,
          },
        })
      }
    >
      <View style={styles.overlay}>
        <View style={styles.rowBetween}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: video?.userId.profileImage }}
              style={styles.avatar}
            />
            <Text style={styles.username}>
              {video?.userId.username.split(".")[0]}
            </Text>
          </View>

          <View style={styles.likes}>
            <Text style={styles.likesText}>36</Text>
            <FontAwesome name="heart" size={12} color="white" />
          </View>
        </View>
      </View>

      <Image source={{ uri: video?.thumbnail }} style={styles.thumbnail} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
  },
  overlay: {
    position: "absolute",
    zIndex: 10,
    bottom: 0,
    padding: 10,
    width: "100%",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 3,
    width: "100%",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  avatar: {
    width: 20,
    height: 20,
    backgroundColor: "white",
    borderRadius: 50,
  },
  username: {
    color: "white",
    fontSize: 12,
  },
  likes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  likesText: {
    color: "white",
    fontSize: 12,
  },
  thumbnail: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
});
