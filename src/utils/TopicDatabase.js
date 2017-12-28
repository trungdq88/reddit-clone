export default class TopicDatabase {
  _subscriptionIdIterator = 0;
  _topicIdIterator = 0;
  maxRecentCount = 20;
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

  constructor(topics, maxRecentCount) {
    this.topics = topics || [];
    this.maxRecentCount = maxRecentCount || 20;
  }

  add = content => {
    const topic = {
      id: ++this._topicIdIterator,
      content,
      upvote: 0,
      downvote: 0,
    };
    this.topics.push(topic);
    this.sort();
    this.notifyLatestTopics();
    return topic;
  };

  upvote = topicId => {
    const topicIndex = this.topics.findIndex(_ => _.id === topicId);
    this.topics[topicIndex] = {
      ...this.topics[topicIndex],
      upvote: this.topics[topicIndex].upvote + 1,
    };
    this.notifyTopic(this.topics[topicIndex]);
    this.sort();
    this.notifyLatestTopics();
  };

  downvote = topicId => {
    const topicIndex = this.topics.findIndex(_ => _.id === topicId);
    this.topics[topicIndex] = {
      ...this.topics[topicIndex],
      downvote: this.topics[topicIndex].downvote + 1,
    };
    this.notifyTopic(this.topics[topicIndex]);
    this.sort();
    this.notifyLatestTopics();
  };

  sort = () => {
    this.topics.sort((a, b) => {
      if (a.upvote - a.downvote < b.upvote - b.downvote) {
        return 1;
      }
      if (a.upvote - a.downvote > b.upvote - b.downvote) {
        return -1;
      }
      return b.id - a.id;
    });
  };

  getLatestTopics = () =>
    // Notice: .slice will create new array
    this.topics.slice(0, this.maxRecentCount);

  notifyTopic = topic => {
    (this.topicSubscriptions[topic.id] || [])
      .map(subId => this.subscriptions[subId])
      .forEach(callback => callback(topic));
  };

  notifyLatestTopics = () => {
    this.latestTopicSubscriptions
      .map(subId => this.subscriptions[subId])
      .forEach(callback => callback(this.getLatestTopics()));
  };

  subscribeLatestTopic = callback => {
    const subscriptionId = ++this._subscriptionIdIterator;
    this.subscriptions[subscriptionId] = callback;
    this.latestTopicSubscriptions = this.latestTopicSubscriptions.concat(
      subscriptionId,
    );
    callback(this.getLatestTopics());
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
}
