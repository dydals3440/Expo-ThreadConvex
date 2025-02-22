import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-react';
import { Link, useRouter } from 'expo-router';
import UserProfile from './UserProfile';
import Tabs from './Tabs';
import { usePaginatedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Thread from './Thread';

type ProfileProps = {
  userId?: Id<'users'>;
  showBackButton?: boolean;
};

const Profile = ({ userId, showBackButton = true }: ProfileProps) => {
  const { userProfile } = useUserProfile();
  const { top } = useSafeAreaInsets();
  const { signOut } = useAuth();
  const router = useRouter();

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    { userId: userId || userProfile?._id },
    { initialNumItems: 5 }
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <Link href={`/(auth)/(tabs)/feed/${item._id}`} asChild>
            <TouchableOpacity>
              <Thread
                thread={item as Doc<'messages'> & { creator: Doc<'users'> }}
              />
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={
          <Text style={styles.tabContentText}>
            You Haven't Posted Anything Yet
          </Text>
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.border,
            }}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              {showBackButton ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <Ionicons name='chevron-back' size={24} color='#000' />
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons name='web' size={24} color='black' />
              )}
              <View style={styles.headerIcons}>
                <Ionicons name='logo-instagram' size={24} color='black' />
                <TouchableOpacity onPress={() => signOut()}>
                  <Ionicons name='log-out-outline' size={24} color='black' />
                </TouchableOpacity>
              </View>
            </View>
            {userId ? (
              <UserProfile userId={userId} />
            ) : (
              <UserProfile userId={userProfile?._id} />
            )}

            <Tabs onTabChange={() => {}} />
          </>
        }
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tabContentText: {
    fontSize: 16,
    marginVertical: 16,
    color: Colors.border,
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 16,
  },
});
