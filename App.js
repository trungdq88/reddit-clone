import React from 'react';
import { StyleSheet, Text, View, Button, FlatList, Alert } from 'react-native';
import LinkItem from './LinkItem.js';

export default class App extends React.Component {
  state = {
    data: [{ value: 'A' }, { value: 'B' }],
  };

  _onPressItem = item => Alert.alert('Hello ' + item);

  _renderItem = ({ item }) => (
    <LinkItem key={item.value} {...item} onPressItem={this._onPressItem} />
  );

  render() {
    return (
      <View style={styles.container}>
        <View sytle={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            <Button
              title="+ Submit Link"
              accessibilityLabel="Submit Link"
              onPress={e => {
                this.setState({
                  data: this.state.data.concat({ value: Math.random() }),
                });
              }}
            />
          </View>
        </View>
        <View style={{ flex: 9, width: '100%' }}>
          <FlatList data={this.state.data} renderItem={this._renderItem} />
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
