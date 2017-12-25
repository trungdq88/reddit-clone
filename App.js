import { Platform, StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen.js';
import TopicScreen from './TopicScreen.js';

export default StackNavigator(
  {
    Home: { screen: HomeScreen },
    Topic: { screen: TopicScreen },
  },
  {
    cardStyle: {
      paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    },
  },
);
