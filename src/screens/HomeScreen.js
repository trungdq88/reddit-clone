import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  FlatList,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import TopicListItem from '../components/TopicListItem.js';
import NewTopicModal from '../components/NewTopicModal.js';
import { TOPIC_MAX_LENGTH } from '../utils/constants.js';
import topicDatabase from '../store/database.js';

const add100000Topics = () => {
  for (let i = 0; i < 50000; i++) {
    topicDatabase.topics.push({
      id: topicDatabase.topics.length,
      content: 'topic ' + topicDatabase.topics.length,
      upvote: 0,
      downvote: 0,
    });
  }
  topicDatabase.add('hello');
};

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
    headerRight: <Button title="Add 50,000 Topic" onPress={add100000Topics} />,
  };

  subscription = null;

  state = {
    newTopicModalVisible: false,
    topics: [],
  };

  componentDidMount() {
    this.subscription = topicDatabase.subscribeLatestTopic(this.onLatestTopic);
  }

  componentWillUnmount() {
    this.subscription && this.subscription.dispose();
  }

  onLatestTopic = topics => {
    this.setState({ topics });
  };

  onPressItem = item => {
    // TODO: Fast clicks trigger multiple navigation (on Android only)
    // https://github.com/react-community/react-navigation/issues/271
    this.props.navigation.navigate('Topic', { topicId: item.id, key: item.id });
  };

  closeNewTopicModal = () => this.setState({ newTopicModalVisible: false });

  keyExtractor = item => item.id;

  openSubmitModal = () => {
    this.setState({
      newTopicModalVisible: true,
    });
  };

  renderItem = ({ item }) => (
    <TopicListItem topic={item} onPressItem={this.onPressItem} />
  );

  render() {
    return (
      <View style={styles.container}>
        <View sytle={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            <Button
              title="+ Submit Topic"
              accessibilityLabel="Submit Topic"
              onPress={this.openSubmitModal}
            />
          </View>
        </View>
        <View style={{ flex: 9, width: '100%' }}>
          {this.state.topics.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#888' }}>
              No topics
            </Text>
          ) : (
            <FlatList
              data={this.state.topics}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
            />
          )}
        </View>
        <NewTopicModal
          visible={this.state.newTopicModalVisible}
          onClose={this.closeNewTopicModal}
          onSubmitTopic={topicDatabase.add}
          maxLength={TOPIC_MAX_LENGTH}
        />
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
