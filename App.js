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
import TopicListItem from './TopicListItem.js';
import TopicDatabase from './TopicDatabase.js';
import NewTopic from './NewTopic.js';

export default class App extends React.Component {
  topics = new TopicDatabase();
  subscription = null;

  state = {
    topics: [],
    newTopicModalVisible: false,
  };

  componentDidMount() {
    this.subscription = this.topics.subscribe(topics =>
      this.setState({ topics }),
    );
  }

  componentWillUnmount() {
    this.subscription && this.subscription.dispose();
  }

  onPressItem = item => Alert.alert('Hello ' + item.content);

  onSubmitTopic = content => {
    this.topics.add(content);
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
        <NewTopic
          visible={this.state.newTopicModalVisible}
          onClose={this.closeNewTopicModal}
          onSubmitTopic={this.onSubmitTopic}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
