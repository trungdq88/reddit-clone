import React from 'react';
import T from 'prop-types';
import { Text, View, TouchableOpacity } from 'react-native';

export default class TopicListItem extends React.Component {
  static propTypes = {
    topic: T.any,
    onPressItem: T.func,
  };

  onPressItem = () =>
    this.props.onPressItem && this.props.onPressItem(this.props.topic);

  render() {
    const { topic, onPressItem } = this.props;
    return (
      <TouchableOpacity onPress={this.onPressItem}>
        <View
          style={{
            backgroundColor: '#eee',
            padding: 20,
            margin: 10,
            marginTop: 0,
            borderRadius: 5,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 20 }}>
              {topic.upvote - topic.downvote}
            </Text>
          </View>
          <View style={{ flex: 9 }}>
            <Text>{topic.content}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
