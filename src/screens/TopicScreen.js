import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class TopicScreen extends React.Component {
  static navigationOptions = {
    title: 'Topic',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.navigation.state.params.topic.content}</Text>
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
