import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import * as Sentry from '@sentry/react-native';

const Page = () => {
  const testError = () => {
    try {
      throw new Error('Test Error');
    } catch (error) {
      const sentryId = Sentry.captureMessage('Matthew We Have a problem');
      console.log('Sentry Id', sentryId);

      const userFeedback: Sentry.UserFeedback = {
        event_id: sentryId,
        name: 'Matthew',
        email: 'dydals3440@gmail.com',
        comments: 'I am having a problem',
      };

      Sentry.captureUserFeedback(userFeedback);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is Feed Page</Text>
      <Button onPress={testError} title='Test Error'></Button>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({});
