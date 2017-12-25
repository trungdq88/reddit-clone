import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, Text, View, Button } from 'react-native';
import actions from '../store/actions.js';

class TopicScreen extends React.Component {
  static navigationOptions = {
    title: 'Topic',
  };

  constructor(...args) {
    super(...args);
    this.topicId = this.props.navigation.state.params.topicId;
  }

  componentDidMount() {
    this.props.actions.getTopicDetail(this.topicId);
  }

  componentWillUnmount() {
    this.props.actions.cleanUpTopicDetail(this.topicId);
  }

  upvote = () => {
    this.props.actions.upvote(this.topicId);
    this.props.actions.getTopicDetail(this.topicId);
  };

  downvote = () => {
    this.props.actions.downvote(this.topicId);
    this.props.actions.getTopicDetail(this.topicId);
  };

  render() {
    const topic = this.props.topicDetail[this.topicId];

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
                title={`▲ Downvote (${topic.downvote})`}
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

export default connect(
  state => state,
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(TopicScreen);
