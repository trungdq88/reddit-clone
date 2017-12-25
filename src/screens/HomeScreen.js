import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
import actions from '../store/actions.js';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  subscription = null;

  state = {
    newTopicModalVisible: false,
  };

  componentDidMount() {
    console.log('mount');
  }

  onPressItem = item =>
    this.props.navigation.navigate('Topic', { topicId: item.id });

  onSubmitTopic = content => {
    this.props.actions.addTopic(content);
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
          {this.props.topics.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#888' }}>
              No topics
            </Text>
          ) : (
            <FlatList
              data={this.props.topics}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
            />
          )}
        </View>
        <NewTopicModal
          visible={this.state.newTopicModalVisible}
          onClose={this.closeNewTopicModal}
          onSubmitTopic={this.onSubmitTopic}
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

export default connect(
  state => state,
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(HomeScreen);
