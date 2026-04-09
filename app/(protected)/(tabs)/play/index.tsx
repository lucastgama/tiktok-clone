import PlayListItem from "@/components/ui/playListItem";
import { supabase } from "@/lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { FlatList, StatusBar, View } from "react-native";

export default function PlayVideoListScreen() {
  const { videos: videosParam, initialIndex: indexParam } =
    useLocalSearchParams();

  const initialVideos: any[] = videosParam
    ? JSON.parse(videosParam as string)
    : [];
  const startIndex = indexParam ? parseInt(indexParam as string) : 0;

  const [videoList, setVideoList] = useState(initialVideos);
  const loadOffset = useRef(initialVideos.length);
  const loadingMore = useRef(false);

  const [visibleIndex, setVisibleIndex] = useState(startIndex);
  const [listHeight, setListHeight] = useState(0);

  const flatListRef = useRef<FlatList>(null);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        setVisibleIndex(viewableItems[0].index ?? 0);
      }
    },
    [],
  );

  const loadMore = async () => {
    if (loadingMore.current) return;
    loadingMore.current = true;
    const offset = loadOffset.current;
    const { data } = await supabase
      .from("PostLists")
      .select(`*, userId:Users (profileImage, username)`)
      .range(offset, offset + 7)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) {
      setVideoList((prev) => {
        const existingIds = new Set(prev.map((v) => v.id));
        const fresh = data.filter((v) => !existingIds.has(v.id));
        return [...prev, ...fresh];
      });
      loadOffset.current = offset + data.length;
    }
    loadingMore.current = false;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar hidden />
      <View
        style={{ flex: 1 }}
        onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}
      >
        {listHeight > 0 && (
          <FlatList
            ref={flatListRef}
            data={videoList}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={({ item, index }) => (
              <PlayListItem
                video={item}
                isVisible={index === visibleIndex}
                onBack={() => router.back()}
                itemHeight={listHeight}
              />
            )}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            initialScrollIndex={startIndex}
            getItemLayout={(_data, index) => ({
              length: listHeight,
              offset: listHeight * index,
              index,
            })}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            viewabilityConfig={viewabilityConfig.current}
            onViewableItemsChanged={onViewableItemsChanged}
          />
        )}
      </View>
    </View>
  );
}
