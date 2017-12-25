import Immutable from 'seamless-immutable';

const INIT_STATE = Immutable({
  topics: [],
  topicDetail: {
    // topicId => object
  },
});

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_LATEST_TOPICS':
      return state.set('topics', action.data);
    case 'TOPIC_DETAIL':
      return state.setIn(['topicDetail', action.data.id], action.data);
    case 'TOPIC_DETAIL_CLEAN_UP':
      return state.set('topicDetail', state.topicDetail.without(action.data));
    default:
      return state;
  }
};
