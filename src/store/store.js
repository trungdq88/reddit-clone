import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import TopicDatabase from '../utils/TopicDatabase.js';
import reducer from './reducer.js';

// Create in-memory database for topics
const db = new TopicDatabase();

// Redux store
const store = createStore(
  reducer,
  applyMiddleware(thunk.withExtraArgument(db)),
);

// Receive new update from db
db.subscribe(topics => {
  store.dispatch({ type: 'UPDATE_LATEST_TOPICS', data: topics });
});

// Endpoint to manipulate topic database
export const topicDatabase = db;

export default store;
