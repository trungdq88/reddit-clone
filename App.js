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
} from 'react-native';
import LinkItem from './LinkItem.js';
import TopicDatabase from './TopicDatabase.js';

const TOPIC_MAX_LENGTH = 50;

export default class App extends React.Component {
  topics = new TopicDatabase();
  subscription = null;

  state = {
    topics: [],
    text: '',
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

  onSubmitTopic = () => {
    this.topics.add({ value: this.state.text });
    this.setState({
      text: '',
      newTopicModalVisible: false,
    });
  };

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
        <Modal
          visible={this.state.newTopicModalVisible}
          onRequestClose={this.onModalClose}
          transparent={true}
        >
          <View
            style={{
              backgroundColor: '#00000055',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                padding: 20,
                backgroundColor: '#fff',
                borderRadius: 5,
                minWidth: '80%',
              }}
            >
              <View style={{ paddingBottom: 20 }}>
                <Text
                  style={{ textAlign: 'left', fontSize: 20, marginBottom: 15 }}
                >
                  Enter topic:
                </Text>
                {/* TODO: how to make it auto scroll to bottom when enter new line? */}
                <TextInput
                  style={{
                    maxHeight: 200,
                    paddingBottom: 15,
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                  onChangeText={text => this.setState({ text })}
                  value={this.state.text}
                  multiline={true}
                  numberOfLines={2}
                  placeholder="Enter topic here..."
                  blurOnSubmit={false}
                />
              </View>
              <Text
                style={{
                  textAlign: 'right',
                  color:
                    this.state.text.length > TOPIC_MAX_LENGTH ? 'red' : '#888',
                  marginBottom: 10,
                }}
              >
                {this.state.text.length}/{TOPIC_MAX_LENGTH}
              </Text>
              <Button
                hardwareAccelerated={true}
                disabled={this.state.text.length > TOPIC_MAX_LENGTH}
                title="+ Submit"
                accessibilityLabel="Submit"
                onPress={this.onSubmitTopic}
              />
            </View>
          </View>
        </Modal>
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
