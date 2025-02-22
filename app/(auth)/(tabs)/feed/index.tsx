import {
  Image,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { usePaginatedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThreadComposer from '@/components/ThreadComposer';
import Thread from '@/components/Thread';
import { Doc } from '@/convex/_generated/dataModel';
import { Link, useFocusEffect, useNavigation } from 'expo-router';
import {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

const Page = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    {},
    { initialNumItems: 5 }
  );
  const [refreshing, setRefreshing] = useState(false);
  const { top } = useSafeAreaInsets();

  // Animation
  const navigation = useNavigation();
  const scrollOffset = useSharedValue(0);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  const updateTabBar = () => {
    let newMarginBottom = 0;
    if (scrollOffset.value >= 0 && scrollOffset.value <= tabBarHeight) {
      newMarginBottom = -scrollOffset.value;
    } else if (scrollOffset.value > tabBarHeight) {
      newMarginBottom = -tabBarHeight;
    }

    navigation
      .getParent()
      ?.setOptions({ tabBarStyle: { marginBottom: newMarginBottom } });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (isFocused) {
        scrollOffset.value = event.contentOffset.y;
        runOnJS(updateTabBar)();
      }
    },
  });

  const onLoadMore = () => {
    loadMore(5);
  };

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused

      return () => {
        navigation
          .getParent()
          ?.setOptions({ tabBarStyle: { marginBottom: 0 } });
      };
    }, [])
  );

  return (
    <Animated.FlatList
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      data={results}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <Link href={`/(auth)/(tabs)/feed/${item._id}`} asChild>
          <TouchableOpacity>
            <Thread
              thread={item as Doc<'messages'> & { creator: Doc<'users'> }}
            />
          </TouchableOpacity>
        </Link>
      )}
      keyExtractor={(item) => item._id}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      // onRefresh={onRefresh}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: Colors.border,
          }}
        />
      )}
      contentContainerStyle={{ paddingVertical: top }}
      ListHeaderComponent={
        <View style={{ paddingBottom: 16 }}>
          <Image
            source={require('@/assets/images/threads-logo-black.png')}
            style={{ width: 40, height: 40, alignSelf: 'center' }}
          />
          <ThreadComposer isPreview />
        </View>
      }
    />
  );
};

export default Page;

const styles = StyleSheet.create({});
