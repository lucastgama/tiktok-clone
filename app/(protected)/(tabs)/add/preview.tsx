import Loading from "@/components/ui/loading";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/expo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PreviewScreen() {
  const { user } = useUser();
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const params = useLocalSearchParams<{
    thumbnailUri?: string;
    videoUri?: string;
  }>();

  const thumbnail = params.thumbnailUri;

  const handlePublish = async () => {
    if (!params.videoUri || !thumbnail) {
      console.log("Vídeo ou thumbnail ausente");
      return;
    }

    try {
      setLoading(true);
      const videoUrl = await uploadFileToAws(params.videoUri, "video");
      const thumbnailUrl = await uploadFileToAws(thumbnail, "image");

      if (!videoUrl || !thumbnailUrl) {
        console.log("Erro ao obter URLs de upload");
        setLoading(false);
        return;
      }

      await publishOnSupabase(videoUrl, thumbnailUrl, description);
    } catch (err) {
      console.log("ERRO GERAL:", err);
      setLoading(false);
    }
  };

  const uploadFileToAws = async (file: string, type: "video" | "image") => {
    try {
      const res = await fetch(
        `http://192.168.1.100:3000/upload-url?type=${type}`,
      );

      const { url } = await res.json();

      const fileBlob = await fetch(file).then((res) => res.blob());

      const uploadRes = await fetch(url, {
        method: "PUT",
        body: fileBlob,
        headers: {
          "Content-Type": type === "video" ? "video/mp4" : "image/jpeg",
        },
      });

      if (!uploadRes.ok) {
        console.log("Erro no upload AWS");
        return null;
      }

      return url.split("?")[0];
    } catch (err) {
      console.log("Erro upload AWS:", err);
      return null;
    }
  };

  const publishOnSupabase = async (
    video: string,
    thumbnail: string,
    description: string,
  ) => {
    if (!video || !thumbnail || !description) {
      console.log("Dados incompletos:", {
        video,
        thumbnail,
        description,
      });
      setLoading(false);
      return;
    }

    const { data: existingUser } = await supabase
      .from("Users")
      .select("id")
      .eq("clerk_id", user?.id)
      .single();

    const { error } = await supabase.from("PostLists").insert({
      videoUrl: video,
      thumbnail: thumbnail,
      description: description,
      emailRef: user?.primaryEmailAddress?.emailAddress,
      clerkId: user?.id,
      userId: existingUser?.id,
    });

    if (error) {
      console.log("SUPABASE ERROR:", error);
    } else {
      router.replace("/home");
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      {loading && <Loading />}

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

          {thumbnail && (
            <Image source={{ uri: thumbnail }} style={styles.image} />
          )}

          <TextInput
            numberOfLines={3}
            placeholder="Description"
            style={styles.description}
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity onPress={handlePublish}>
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
