export default class TopicDatabase {
  _subscriptionIdIterator = 0;
  _topicIdIterator = 0;
  maxRecentCount = 20;
  topics = [
    /* topicId */
  ];
  topicsMap = {
    // topicId => topic object
  };
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
    this.topicsMap[topic.id] = topic;
    this.topics = [topic.id].concat(this.topics);
    this.notifyLatestTopics();
    return topic;
  };

  upvote = topicId => {
    this.topicsMap[topicId] = {
      ...this.topicsMap[topicId],
      upvote: this.topicsMap[topicId].upvote + 1,
    };
    this.notifyLatestTopics();
    this.notifyTopic(topicId);
  };

  downvote = topicId => {
    this.topicsMap[topicId] = {
      ...this.topicsMap[topicId],
      downvote: this.topicsMap[topicId].downvote + 1,
    };
    this.notifyLatestTopics();
    this.notifyTopic(topicId);
  };

  sort = () => {
    this.topics.sort((a, b) => {
      const x = this.topicsMap[a];
      const y = this.topicsMap[b];
      if (x.upvote - x.downvote < y.upvote - y.downvote) {
        return 1;
      }
      if (x.upvote - x.downvote > y.upvote - y.downvote) {
        return -1;
      }
      return y.id - x.id;
    });
    // force create new object
    this.topics = this.topics.concat([]);
  };

  getLatestTopics = () => {
    return this.topics
      .slice(0, this.maxRecentCount)
      .map(topicId => this.topicsMap[topicId]);
  };

  notifyTopic = topicId => {
    (this.topicSubscriptions[topicId] || [])
      .map(subId => this.subscriptions[subId])
      .forEach(callback => callback(this.topicsMap[topicId]));
  };

  notifyLatestTopics = () => {
    this.sort();
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
    callback(this.topicsMap[topicId]);

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
