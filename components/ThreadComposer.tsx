import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  InputAccessoryView,
  Alert,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { Stack, useRouter } from 'expo-router';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Colors } from '@/constants/Colors';
import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ImagePickerAsset } from 'expo-image-picker';
import * as ImagePicker from 'expo-image-picker';

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
  const [mediaFiles, setMediaFiles] = useState<ImagePickerAsset[]>([]);
  const addThread = useMutation(api.messages.addThreadMessage);
  const inputAccessoryViewID = 'uniqueId';

  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const handleSubmit = async () => {
    const mediaIds = await Promise.all(mediaFiles.map(uploadMediaFile));

    addThread({
      threadId,
      content: threadContent,
      mediaFiles: mediaIds,
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
    setThreadContent('');
    Alert.alert('Discard thread?', '', [
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => router.dismiss(),
      },
      {
        text: 'Save Draft',
        style: 'cancel',
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const selectImage = async (type: 'library' | 'camera') => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
    };

    let result;

    if (type === 'library') {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      result = await ImagePicker.launchCameraAsync(options);
    }
    if (!result.canceled) {
      setMediaFiles([result.assets[0], ...mediaFiles]);
    }
  };

  const uploadMediaFile = async (image: ImagePickerAsset) => {
    const uploadUrl = await generateUploadUrl();

    const response = await fetch(image.uri);
    const blob = await response.blob();
    const result = await fetch(uploadUrl, {
      method: 'POST',
      body: blob,
      headers: { 'Content-Type': image.mimeType! },
    });
    const { storageId } = await result.json();

    return storageId;
  };

  return (
    <TouchableOpacity
      onPress={() => {
        router.push('/(auth)/(modal)/create');
      }}
      style={
        isPreview && {
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          pointerEvents: 'box-only',
          height: 100,
        }
      }
    >
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
        <View style={styles.centerContainer}>
          <Text style={styles.name}>
            {userProfile?.first_name} {userProfile?.last_name}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={isReply ? 'Reply to thread' : "What's new?"}
            value={threadContent}
            onChangeText={setThreadContent}
            multiline
            autoFocus={!isPreview}
            inputAccessoryViewID={inputAccessoryViewID}
          />

          {mediaFiles.length > 0 && (
            <ScrollView horizontal>
              {mediaFiles.map((file, index) => (
                <View key={index} style={styles.mediaContainer}>
                  <Image source={{ uri: file.uri }} style={styles.mediaImage} />
                  <TouchableOpacity
                    style={styles.deleteIconContainer}
                    onPress={() => {
                      setMediaFiles(mediaFiles.filter((_, i) => i !== index));
                    }}
                  >
                    <Ionicons name='close' size={16} color='white' />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <View style={styles.iconRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectImage('library')}
            >
              <Ionicons name='images-outline' size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectImage('camera')}
            >
              <Ionicons name='camera-outline' size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name='gif' size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name='mic-outline' size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome6 name='hashtag' size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name='stats-chart-outline'
                size={24}
                color={Colors.border}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={removeThread}
          style={[styles.cancelButton, { opacity: isPreview ? 0 : 1 }]}
        >
          <Ionicons name='close' size={24} color={Colors.border} />
        </TouchableOpacity>
      </View>

      <InputAccessoryView nativeID={inputAccessoryViewID}>
        <View style={[styles.keyboardAccessory]}>
          <Text style={styles.keyboardAccessoryText}>
            {isReply
              ? 'Everyone can reply and quote'
              : ' Profiles that you follow can reply and quote'}
          </Text>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </InputAccessoryView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  centerContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
  },
  cancelButton: {
    marginLeft: 12,
    alignSelf: 'flex-start',
  },
  iconRow: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  iconButton: {
    marginRight: 16,
  },
  keyboardAccessory: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 64,
    gap: 12,
  },
  keyboardAccessoryText: {
    flex: 1,
    color: Colors.border,
  },
  submitButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mediaContainer: {
    position: 'relative',
    marginRight: 10,
    marginTop: 10,
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  mediaImage: {
    width: 150,
    height: 200,
    borderRadius: 6,
    marginRight: 10,
    marginTop: 10,
  },
});

export default ThreadComposer;
