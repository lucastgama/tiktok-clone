import PlayListItem from "@/components/ui/playListItem";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, StatusBar, View } from "react-native";

export default function PlayVideoListScreen() {
  const { videos: videosParam, initialIndex: indexParam } =
    useLocalSearchParams();

  const videos: any[] = videosParam ? JSON.parse(videosParam as string) : [];
  const startIndex = indexParam ? parseInt(indexParam as string) : 0;

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

  useEffect(() => {
    if (listHeight > 0 && startIndex > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: startIndex * listHeight,
          animated: false,
        });
      }, 50);
    }
  }, [listHeight]);

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
            data={videos}
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
            viewabilityConfig={viewabilityConfig.current}
            onViewableItemsChanged={onViewableItemsChanged}
          />
        )}
      </View>
    </View>
  );
}
