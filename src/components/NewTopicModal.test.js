import React from 'react';
import NewTopicModal from './NewTopicModal.js';
import renderer from 'react-test-renderer';

// Handle .focus() in test environment
// @see https://github.com/facebook/jest/issues/3707
jest.mock('TextInput', () => {
  const RealComponent = require.requireActual('TextInput');
  const React = require('React');
  class TextInput extends React.Component {
    render() {
      delete this.props.autoFocus;
      return React.createElement('TextInput', this.props, this.props.children);
    }
  }
  TextInput.propTypes = RealComponent.propTypes;
  return TextInput;
});

describe('NewTopicModal.js', () => {
  it('should render ok', () => {
    const rendered = renderer.create(<NewTopicModal />);
    expect(rendered.toJSON()).toBeTruthy();
  });

  it('should call onSubmitTopic with topic content', () => {
    const submitCallback = jest.fn();
    const rendered = renderer.create(
      <NewTopicModal onSubmitTopic={submitCallback} />,
    );
    const contentInput = rendered.root.find(
      instance => instance.props.testID === 'topic-content-input',
    );
    const submitButton = rendered.root.find(
      instance => instance.props.testID === 'submit-topic-btn',
    );
    contentInput.props.onChangeText('hello');
    submitButton.props.onPress();
    expect(submitCallback).toBeCalledWith('hello');
  });

  it('should not call onSubmitTopic if content is empty', () => {
    const submitCallback = jest.fn();
    const rendered = renderer.create(
      <NewTopicModal onSubmitTopic={submitCallback} />,
    );
    const contentInput = rendered.root.find(
      instance => instance.props.testID === 'topic-content-input',
    );
    const submitButton = rendered.root.find(
      instance => instance.props.testID === 'submit-topic-btn',
    );
    contentInput.props.onChangeText('');
    submitButton.props.onPress();
    expect(submitCallback).not.toBeCalled();
  });

  it('should close popup after submit', () => {
    const closeCallback = jest.fn();
    const rendered = renderer.create(
      <NewTopicModal onSubmitTopic={() => {}} onClose={closeCallback} />,
    );
    const contentInput = rendered.root.find(
      instance => instance.props.testID === 'topic-content-input',
    );
    const submitButton = rendered.root.find(
      instance => instance.props.testID === 'submit-topic-btn',
    );
    contentInput.props.onChangeText('hello');
    submitButton.props.onPress();
    expect(closeCallback).toBeCalledWith();
  });

  it('should close popup when content empty', () => {
    const closeCallback = jest.fn();
    const rendered = renderer.create(
      <NewTopicModal onSubmitTopic={() => {}} onClose={closeCallback} />,
    );
    const contentInput = rendered.root.find(
      instance => instance.props.testID === 'topic-content-input',
    );
    const submitButton = rendered.root.find(
      instance => instance.props.testID === 'submit-topic-btn',
    );
    contentInput.props.onChangeText('');
    submitButton.props.onPress();
    expect(closeCallback).toBeCalledWith();
  });
});
