export default class TopicDatabase {
  _subscriptionIdIterator = 0;
  _topicIdIterator = 0;
  topics = [];
  subscriptions = {
    // subscriptionId => callback
  };

  constructor(topics) {
    this.topics = topics || [];
  }

  add = content => {
    this.topics = [
      { id: ++this._topicIdIterator, content, upvote: 0, downvote: 0 },
    ].concat(this.topics);
    this.notify();
  };

  // TODO: Must be someway faster
  getTopicById = topicId => {
    return this.topics.find(_ => _.id === topicId);
  };

  notify = () => {
    // TODO: this implementation do not guarantee subscrition order.
    Object.values(this.subscriptions)
      .filter(callback => callback !== null)
      .forEach(callback => callback(this.topics));
  };

  subscribe = (callback, generator) => {
    const subscriptionId = ++this._subscriptionIdIterator;
    this.subscriptions[subscriptionId] = callback;
    return {
      id: subscriptionId,
      dispose: () => (this.subscriptions[subscriptionId] = null),
    };
  };
}
