import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";

export default function PreviewScreen() {
  const [desciption, setDescription] = useState<string>("");
  const params = useLocalSearchParams<{
    thumbnailUri?: string;
    videoUri?: string;
  }>();
  const thumbnail = params.thumbnailUri;

  const UploadFileToAws = async (file: string) => {
    console.log("Uploading file to AWS S3...");
    console.log("File URI:", file);
    const res = await fetch("http://192.168.1.100:3000/upload-url");
    const { url } = await res.json();

    const fileBlob = await fetch(file).then((res) => res.blob());
    console.log("File blob created:", fileBlob);
    const uploadRes = await fetch(url, {
      method: "PUT",
      body: fileBlob,
      headers: {
        "Content-Type": "video/mp4",
      },
    });

    console.log("UPLOAD STATUS:", uploadRes.status);

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.log("UPLOAD ERROR:", errorText);
      alert("Erro no upload");
      return;
    }

    alert("Upload feito com sucesso 🚀");
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome
              name="arrow-circle-o-left"
              size={38}
              color="black"
              style={{ margin: 8 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Add details</Text>
          <Image source={{ uri: thumbnail }} style={styles.image} />
          <TextInput
            numberOfLines={3}
            placeholder="Description"
            style={styles.description}
            onChange={(value) => setDescription(value.nativeEvent.text)}
          />
          <TouchableOpacity onPress={() => UploadFileToAws(params.videoUri!)}>
            <Text style={styles.uploadBtn}>Publish</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 300,
    marginBottom: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "gray",
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 10,
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
