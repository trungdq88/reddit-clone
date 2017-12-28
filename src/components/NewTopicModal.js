import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import T from 'prop-types';

export default class NewTopicModal extends Component {
  static propTypes = {
    visible: T.bool,
    onClose: T.func,
    onSubmitTopic: T.func,
    maxLength: T.number,
  };

  state = {
    text: '',
  };

  onSubmitTopic = () => {
    if (!this.state.text) {
      this.props.onClose && this.props.onClose();
      return;
    }
    if (this.props.onSubmitTopic) {
      this.props.onSubmitTopic(this.state.text);
      this.setState({ text: '' });
      this.props.onClose && this.props.onClose();
    }
  };

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onRequestClose={this.props.onClose}
        transparent={true}
        animationType="fade"
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
      >
        <TouchableWithoutFeedback onPress={this.props.onClose}>
          <View
            style={{
              backgroundColor: '#00000055',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <KeyboardAvoidingView behavior="padding">
              <TouchableWithoutFeedback onPress={() => {}}>
                <View
                  style={{
                    padding: 20,
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    minWidth: '80%',
                    marginBottom: Platform.OS === 'ios' ? 40 : undefined,
                  }}
                >
                  <View style={{ paddingBottom: 20 }}>
                    <Text
                      style={{
                        textAlign: 'left',
                        fontSize: 20,
                        marginBottom: 15,
                      }}
                    >
                      Enter topic:
                    </Text>
                    <TextInput
                      style={{
                        maxHeight: 200,
                        paddingBottom: 15,
                        paddingLeft: 5,
                        paddingRight: 5,
                      }}
                      onChangeText={text => this.setState({ text })}
                      value={this.state.text}
                      placeholder="Enter topic here..."
                      onSubmitEditing={this.onSubmitTopic}
                      autoFocus
                      testID="topic-content-input"
                    />
                  </View>
                  <Text
                    style={{
                      textAlign: 'right',
                      color:
                        this.state.text.length > this.props.maxLength
                          ? 'red'
                          : '#888',
                      marginBottom: 10,
                    }}
                  >
                    {this.state.text.length}/{this.props.maxLength}
                  </Text>
                  <Button
                    disabled={
                      this.state.text.length === 0 ||
                      this.state.text.length > this.props.maxLength
                    }
                    title="+ Submit"
                    accessibilityLabel="Submit"
                    onPress={this.onSubmitTopic}
                    testID="submit-topic-btn"
                  />
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
