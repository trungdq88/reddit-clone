import React from 'react';
import { StyleSheet, Text, View, Button, FlatList, Alert } from 'react-native';
import LinkItem from './LinkItem.js';
import TopicDatabase from './TopicDatabase.js';

export default class App extends React.Component {
  topics = new TopicDatabase();
  subscription = null;

  state = {
    topics: [],
  };

  componentDidMount() {
    this.subscription = this.topics.subscribe(topics =>
      this.setState({ topics }),
    );
  }

  componentWillUnmount() {
    this.subscription && this.subscription.dispose();
  }

  _onPressItem = item => Alert.alert('Hello ' + item);

  _onSubmitTopic = () => {
    this.topics.add({ value: Math.random() });
  };

  _keyExtractor = item => item.value;

  _renderItem = ({ item }) => (
    <LinkItem {...item} onPressItem={this._onPressItem} />
  );

  render() {
    return (
      <View style={styles.container}>
        <View sytle={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            <Button
              title="+ Submit Topic"
              accessibilityLabel="Submit Topic"
              onPress={this._onSubmitTopic}
            />
          </View>
        </View>
        <View style={{ flex: 9, width: '100%' }}>
          <FlatList
            data={this.state.topics}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
          />
        </View>
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
