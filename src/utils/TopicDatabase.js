export default class TopicDatabase {
  _subscriptionIdIterator = 0;
  _topicIdIterator = 0;
  topics = [];
  subscriptions = {
    // subscriptionId => callback
  };
  topicSubscriptions = {
    // topicId => [subscriptionId,...]
  };
  latestTopicSubscriptions = [
    /* subscriptionId */
  ];

  constructor(topics) {
    this.topics = topics || [];
  }

  subscribeTopic = (topicId, callback) => {
    const subscriptionId = ++this._subscriptionIdIterator;
    this.subscriptions[subscriptionId] = callback;

    // init empty array if not exist
    this.topicSubscriptions[topicId] = (
      this.topicSubscriptions[topicId] || []
    ).concat(subscriptionId);

    // trigger callback first time
    callback(this.topics.find(t => t.id === topicId));

    // return subscription object
    return {
      id: subscriptionId,
      dispose: () => {
        this.subscriptions[subscriptionId] = null;
        this.topicSubscriptions[topicId] = (
          this.topicSubscriptions[topicId] || []
        ).filter(subId => subId !== subscriptionId);
      },
    };
  };

  add = content => {
    const topic = {
      id: ++this._topicIdIterator,
      content,
      upvote: 0,
      downvote: 0,
    };
    this.topics = [topic].concat(this.topics);
    this.notifyLatestTopics();
    return topic;
  };

  // TODO: Must be someway faster
  getTopicById = topicId => {
    return this.topics.find(_ => _.id === topicId);
  };

  upvote = topicId => {
    const topicIndex = this.topics.findIndex(_ => _.id === topicId);
    this.topics[topicIndex] = {
      ...this.topics[topicIndex],
      upvote: this.topics[topicIndex].upvote + 1,
    };
    this.notifyLatestTopics();
    this.notifyTopic(topicId);
  };

  downvote = topicId => {
    const topicIndex = this.topics.findIndex(_ => _.id === topicId);
    this.topics[topicIndex] = {
      ...this.topics[topicIndex],
      downvote: this.topics[topicIndex].downvote + 1,
    };
    this.notifyLatestTopics();
    this.notifyTopic(topicId);
  };

  // TODO: need better data structure
  sort = () => {
    this.topics.sort((a, b) => {
      return a.upvote - a.downvote < b.upvote - b.downvote ? 1 : -1;
    });
    // force create new object
    this.topics = this.topics.concat([]);
  };

  notifyTopic = topicId => {
    (this.topicSubscriptions[topicId] || [])
      .map(subId => this.subscriptions[subId])
      .forEach(callback => callback(this.topics.find(t => t.id === topicId)));
  };

  notifyLatestTopics = () => {
    this.sort();
    this.latestTopicSubscriptions
      .map(subId => this.subscriptions[subId])
      .forEach(callback => callback(this.topics));
  };

  subscribeLatestTopic = callback => {
    const subscriptionId = ++this._subscriptionIdIterator;
    this.subscriptions[subscriptionId] = callback;
    this.latestTopicSubscriptions = this.latestTopicSubscriptions.concat(
      subscriptionId,
    );
    callback(this.topics);
    return {
      id: subscriptionId,
      dispose: () => {
        this.subscriptions[subscriptionId] = null;
        this.latestTopicSubscriptions = this.latestTopicSubscriptions.filter(
          subId => subId !== subscriptionId,
        );
      },
    };
  };
}
