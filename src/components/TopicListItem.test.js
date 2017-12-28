import React from 'react';
import TopicListItem from './TopicListItem.js';
import renderer from 'react-test-renderer';

describe('TopicListItem.js', () => {
  it('should render ok', () => {
    const rendered = renderer.create(<TopicListItem topic={{}} />);
    expect(rendered.toJSON()).toBeTruthy();
  });

  it('should call onPressItem when press to item', () => {
    const callback = jest.fn();
    const rendered = renderer.create(
      <TopicListItem onPressItem={callback} topic={{}} />,
    );
    const item = rendered.root.find(
      instance => instance.props.testID === 'topic-item',
    );
    item.props.onPress();
    expect(callback).toBeCalled();
  });
});
