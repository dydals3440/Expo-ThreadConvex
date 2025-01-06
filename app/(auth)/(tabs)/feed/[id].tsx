import Thread from '@/components/Thread';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = useQuery(api.messages.getThreadById, {
    messageId: id as Id<'messages'>,
  });

  return (
    <View>
      <ScrollView>
        {thread ? (
          <Thread
            thread={thread as Doc<'messages'> & { creator: Doc<'users'> }}
          />
        ) : (
          <ActivityIndicator />
        )}
      </ScrollView>
    </View>
  );
};

export default Page;
const styles = StyleSheet.create({});
