import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { Stack, useRouter } from 'expo-router';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

type ThreadComposerProps = {
  isPreview?: boolean;
  isReply?: boolean;
  threadId?: Id<'messages'>;
};

const ThreadComposer = ({
  isPreview,
  isReply,
  threadId,
}: ThreadComposerProps) => {
  const router = useRouter();
  const [threadContent, setThreadContent] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const { userProfile } = useUserProfile();
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const addThread = useMutation(api.mesages.addThreadMessage);

  const handleSubmit = async () => {
    addThread({
      threadId,
      content: threadContent,
    });
    setThreadContent('');
    setMediaFiles([]);
    router.dismiss();
  };

  const removeThread = () => {
    setThreadContent('');
    setMediaFiles([]);
  };

  const handleCancel = async () => {
    // TODO
  };

  return (
    <View>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.topRow}>
        <Image
          source={{ uri: userProfile?.imageUrl as string }}
          style={styles.avatar}
        />
      </View>
    </View>
  );
};

export default ThreadComposer;

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
});
