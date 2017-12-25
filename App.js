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
import LinkItem from './LinkItem.js';
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

  onPressItem = item => Alert.alert('Hello ' + item);

  onSubmitTopic = value => {
    this.topics.add({ value });
  };

  closeNewTopicModal = () => this.setState({ newTopicModalVisible: false });

  onModalClose = e => {
    console.log(e);
  };

  keyExtractor = item => item.value;

  openSubmitModal = () => {
    this.setState({
      newTopicModalVisible: true,
    });
  };

  renderItem = ({ item }) => (
    <LinkItem {...item} onPressItem={this.onPressItem} />
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
          <FlatList
            data={this.state.topics}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
          />
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
