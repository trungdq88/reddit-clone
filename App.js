import { Platform, StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';
import HomeScreen from './src/screens/HomeScreen.js';
import TopicScreen from './src/screens/TopicScreen.js';

export default StackNavigator(
  {
    Home: { screen: HomeScreen },
    Topic: { screen: TopicScreen },
  },
  {
    cardStyle: {
      // Fix Android status bar overlap issue
      paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    },
  },
);
