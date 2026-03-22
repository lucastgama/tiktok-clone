import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAuth, useOAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/home");
    }
  }, [isLoaded, isSignedIn]);


const handleLogin = async () => {
  try {
    const { createdSessionId, setActive } = await startOAuthFlow();

    if (createdSessionId && setActive) {
      await setActive({ session: createdSessionId });
    }
  } catch (err) {
    console.error("OAuth error:", err);
  }
};
  const videoSource =
    "https://cdn.pixabay.com/video/2025/08/12/296958_large.mp4";

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <View style={styles.container}>
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        contentFit="cover"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        pointerEvents="none"
      />

      <View style={styles.overlay}>
        <Text style={styles.titleText}>TikTok Clone</Text>

        <Text style={styles.subtitleText}>
          The best place to upload videos and images for everyone to see.
        </Text>

        <TouchableOpacity style={styles.googleButton} onPress={handleLogin}>
          <Image
            source={require("../../assets/images/google.png")}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: theme.backgroundTransp,
  },

  titleText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "700",
    position: "absolute",
    top: 100,
  },

  subtitleText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "300",
    position: "absolute",
    top: 160,
  },

  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    position: "absolute",
    bottom: 130,
  },

  googleButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },

  googleIcon: {
    width: 24,
    height: 24,
  },
});
