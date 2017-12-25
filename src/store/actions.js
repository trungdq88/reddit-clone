export default {
  addTopic: content => (dispatch, getState, db) => {
    db.add(content);
  },

  getTopicDetail: topicId => (dispatch, getState, db) => {
    const topic = db.getTopicById(topicId);
    dispatch({
      type: 'TOPIC_DETAIL',
      data: topic,
    });
  },

  cleanUpTopicDetail: topicId => ({
    type: 'TOPIC_DETAIL_CLEAN_UP',
    data: topicId,
  }),
};
