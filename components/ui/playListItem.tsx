import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  video: any;
  isVisible: boolean;
  onBack: () => void;
  itemHeight: number;
}

export default function PlayListItem({
  video,
  isVisible,
  onBack,
  itemHeight,
}: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(36);
  const [paused, setPaused] = useState(false);

  const player = useVideoPlayer(video?.videoUrl ?? null, (p) => {
    p.loop = true;
  });

  useEffect(() => {
    if (!isVisible) {
      player.pause();
    } else if (!paused) {
      player.play();
    }
  }, [isVisible]);

  const togglePlayPause = () => {
    if (paused) {
      player.play();
    } else {
      player.pause();
    }
    setPaused(!paused);
  };

  return (
    <View style={[styles.container, { height: itemHeight }]}>
      <TouchableOpacity
        activeOpacity={1}
        style={StyleSheet.absoluteFill}
        onPress={togglePlayPause}
      >
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
        />
      </TouchableOpacity>

      {paused && (
        <View style={styles.pauseOverlay} pointerEvents="none">
          <FontAwesome name="pause" size={60} color="rgba(255,255,255,0.6)" />
        </View>
      )}

      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
            <FontAwesome name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>For You</Text>
          <View style={styles.iconBtn} />
        </View>

        <View style={styles.actionBar}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: video?.userId?.profileImage }}
              style={styles.avatar}
              contentFit="cover"
            />
          </View>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              setLiked(!liked);
              setLikeCount(liked ? likeCount - 1 : likeCount + 1);
            }}
          >
            <FontAwesome
              name={liked ? "heart" : "heart-o"}
              size={32}
              color={liked ? "#ff2d55" : "white"}
            />
            <Text style={styles.actionLabel}>{likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <FontAwesome name="comment" size={30} color="white" />
            <Text style={styles.actionLabel}>12</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomInfo} pointerEvents="none">
          <Text style={styles.username}>
            @{video?.userId?.username?.split(".")[0]}
          </Text>
          {video?.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {video.description}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  actionBar: {
    position: "absolute",
    right: 12,
    bottom: 110,
    alignItems: "center",
    gap: 22,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 6,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "white",
  },
  actionItem: {
    alignItems: "center",
    gap: 5,
  },
  actionLabel: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  bottomInfo: {
    position: "absolute",
    bottom: 50,
    left: 16,
    right: 90,
    gap: 6,
  },
  username: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  description: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    lineHeight: 19,
  }
});
