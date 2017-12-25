import React from 'react';
import T from 'prop-types';
import { Text, View, TouchableOpacity } from 'react-native';

export default class LinkItem extends React.Component {
  static propTypes = {
    value: T.any,
    onPressItem: T.func,
  };

  _onPressItem = () =>
    this.props.onPressItem && this.props.onPressItem(this.props.value);

  render() {
    const { value, onPressItem } = this.props;
    return (
      <TouchableOpacity onPress={this._onPressItem}>
        <View
          style={{
            backgroundColor: '#eee',
            padding: 20,
            margin: 10,
            marginTop: 0,
            borderRadius: 5,
          }}
        >
          <Text>{value}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
