import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Doc } from '@/convex/_generated/dataModel';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type ThreadProps = {
  thread: Doc<'messages'> & {
    creator: Doc<'users'>;
  };
};

const Thread = ({ thread }: ThreadProps) => {
  const {
    content,
    mediaFiles,
    likeCount,
    commentCount,
    retweetCount,
    creator,
  } = thread;
  return (
    <View style={styles.container}>
      <Image source={{ uri: creator.imageUrl }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.headerTextName}>
              {creator.first_name} {creator.last_name}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(thread._creationTime).toLocaleDateString()}
            </Text>
          </View>
          <Ionicons
            name='ellipsis-horizontal'
            size={24}
            color={Colors.border}
          />
        </View>
        <Text style={styles.content}>{content}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Ionicons name='heart-outline' size={24} color='black' />
            <Text style={styles.actionText}>{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name='chatbubble-outline' size={24} color='black' />
            <Text style={styles.actionText}>{commentCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name='repeat-outline' size={24} color='black' />
            <Text style={styles.actionText}>{retweetCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name='send' size={22} color='black' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Thread;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextName: {
    fontWeight: 'bold',
    marginRight: 5,
    gap: 4,
    alignItems: 'center',
    fontSize: 16,
  },
  timestamp: {
    color: '#777',
    fontSize: 12,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
  },
});
