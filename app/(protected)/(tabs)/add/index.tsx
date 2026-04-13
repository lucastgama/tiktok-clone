import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { router } from "expo-router";

export default function AddScreen() {
  const [video, setVideo] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const selectVideo = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "videos",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      generateThumbnail(result.assets[0].uri);
    }
  };

  const generateThumbnail = async (videoUri: string) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 15000,
      });
      setImage(uri);
      router.push({
        pathname: "/add/preview",
        params: {
          videoUri: videoUri,
          thumbnailUri: uri,
        },
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../../assets/images/upload-file.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Start upload Shot video</Text>
      <Text style={styles.description}>
        Upload your short video and share it with the world!
      </Text>
      <TouchableOpacity onPress={selectVideo}>
        <Text style={styles.uploadBtn}>Select Video File</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "gray",
  },
  uploadBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "blue",
    borderRadius: 5,
    color: "white",
  },
});
