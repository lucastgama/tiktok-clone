import { useVideoPlayer, VideoView } from "expo-video";
import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";

export default function LoginScreen() {
  const videoSource =
    "https://cdn.pixabay.com/video/2025/08/12/296958_large.mp4";

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <View style={{ flex: 1 }}>
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        contentFit="cover"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        pointerEvents="none"
      />

      <View style={styles.topTitle}>
        <Text style={styles.title}>Tik Tok Clone</Text>
        <Text style={styles.text}>
          The best place to upload videos and images for everyone to see.
        </Text>
        <View style={styles.signGoogle}>
          <Image
            source={require("../assets/images/google.png")}
            style={{ width: 24, height: 24 }}
          />
          <Text>Sign In With Google</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topTitle: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: theme.backgroundTransp,
  },
  title: {
    color: "#fff",
    fontSize: 35,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "300",
    marginTop: 16,
  },
  signGoogle: {
    display: "flex",
    alignContent: "center",
    gap: 8,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding:8,
    borderRadius: 12,
  },
});
