import { Text, View } from "react-native";
import { useUser } from "@clerk/expo";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
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
        });

        if (insertError) {
          console.log("INSERT ERROR:", insertError);
        } 
      } else {
        console.log("USER JÁ EXISTE");
      }
    };

    syncUser();
  }, [user?.id]);

  return (
    <View>
      <Text>Usuário logado 🎉</Text>
      <Text>{user?.primaryEmailAddress?.emailAddress}</Text>
    </View>
  );
}
