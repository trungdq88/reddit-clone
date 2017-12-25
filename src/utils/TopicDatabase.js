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

  upvote = topicId => {
    const topicIndex = this.topics.findIndex(_ => _.id === topicId);
    this.topics[topicIndex].upvote += 1;
    this.notify();
  };

  downvote = topicId => {
    const topicIndex = this.topics.findIndex(_ => _.id === topicId);
    this.topics[topicIndex].downvote += 1;
    this.notify();
  };

  // TODO: need better data structure
  sort = () => {
    this.topics.sort((a, b) => {
      return a.upvote - a.downvote < b.upvote - b.downvote ? 1 : -1;
    });
  };

  notify = () => {
    this.sort();
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
