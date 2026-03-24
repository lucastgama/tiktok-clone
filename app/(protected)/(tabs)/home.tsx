import { Image, Text, View } from "react-native";
import { useUser } from "@clerk/expo";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function HomeScreen() {
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const syncUser = async () => {
      console.log("SYNC USER HOME:", user.id);

      const { data: existingUser, error: selectError } = await supabase
        .from("Users")
        .select("id")
        .eq("clerk_id", user.id)
        .maybeSingle();

      if (selectError) {
        console.log("SELECT ERROR:", selectError);
        return;
      }

      if (!existingUser) {
        const { error: insertError } = await supabase.from("Users").insert({
          clerk_id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.firstName,
          username: user.primaryEmailAddress?.emailAddress?.split("@")[0],
          profileImage: user.imageUrl,
        });
        if (insertError) {
          console.log("INSERT ERROR:", insertError);
        }
      }
    };

    syncUser();
  }, [user?.id]);

  return (
    <View>
      <Text>Usuário logado 🎉</Text>
      <Text>{user?.primaryEmailAddress?.emailAddress}</Text>
      <Image
        source={{ uri: user?.imageUrl }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
    </View>
  );
}
