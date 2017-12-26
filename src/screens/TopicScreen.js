import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import topicDatabase from '../store/database.js';

export default class TopicScreen extends React.Component {
  static navigationOptions = {
    title: 'Topic',
  };

  subscription = null;

  constructor(...args) {
    super(...args);
    this.topicId = this.props.navigation.state.params.topicId;
    this.state = {
      topic: null,
    };
  }

  componentDidMount() {
    this.subscription = topicDatabase.subscribeTopic(
      this.topicId,
      this.onTopicDetail,
    );
  }

  componentWillUnmount() {
    this.subscription && this.subscription.dispose();
  }

  onTopicDetail = topic => this.setState({ topic });

  upvote = () => {
    topicDatabase.upvote(this.topicId);
  };

  downvote = () => {
    topicDatabase.downvote(this.topicId);
  };

  render() {
    const topic = this.state.topic;

    if (!topic) return null; // or loading

    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 5,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Text>{topic.content}</Text>
        </View>

        <View style={{ flex: 3 }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ margin: 10 }}>
              <Button
                title={`▲ Upvote (${topic.upvote})`}
                accessibilityLabel="Submit Topic"
                onPress={this.upvote}
              />
            </View>
            <View style={{ margin: 10 }}>
              <Button
                title={`▼ Downvote (${topic.downvote})`}
                color="orange"
                accessibilityLabel="Down vote"
                onPress={this.downvote}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
