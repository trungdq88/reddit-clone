import MaxQueue from './MaxQueue.js';

export default class TopicDatabase {
  _subscriptionIdIterator = 0;
  _topicIdIterator = 0;
  maxRecentCount = 20;
  topics = null;
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
    this.topics = topics || new MaxQueue([], this.comparator);
    this.maxRecentCount = maxRecentCount || 20;
  }

  comparator = (x, y) => {
    const a = this.topicsMap[x];
    const b = this.topicsMap[y];
    if (a === undefined || b === undefined) return 1;
    if (a.upvote - a.downvote < b.upvote - b.downvote) {
      return 1;
    }
    if (a.upvote - a.downvote > b.upvote - b.downvote) {
      return -1;
    }
    return b.id - a.id;
  };

  // O(log(n))
  add = content => {
    const topic = {
      id: ++this._topicIdIterator,
      content,
      upvote: 0,
      downvote: 0,
    };

    this.topicsMap[topic.id] = topic;
    this.topics.insert(topic.id);
    this.notifyLatestTopics();
    return topic;
  };

  upvote = topicId => {
    this.topicsMap[topicId] = {
      ...this.topicsMap[topicId],
      upvote: this.topicsMap[topicId].upvote + 1,
    };
    this.reindexQueue();
    this.notifyLatestTopics();
    this.notifyTopic(topicId);
  };

  downvote = topicId => {
    this.topicsMap[topicId] = {
      ...this.topicsMap[topicId],
      downvote: this.topicsMap[topicId].downvote + 1,
    };
    this.reindexQueue();
    this.notifyLatestTopics();
    this.notifyTopic(topicId);
  };

  // O(n*log(n))
  reindexQueue = () => {
    const tmp = [];
    console.log(this.topics.tree);
    while (this.topics.getMax() !== undefined) {
      tmp.push(this.topics.removeMax());
    }
    console.log('tmp', tmp);
    tmp.forEach(item => this.topics.insert(item));
    console.log(this.topics.tree);
  };

  // O(maxRecentCount*log(n))
  getLatestTopics = () => {
    const output = [];
    for (let i = 0; i < this.maxRecentCount; i++) {
      const max = this.topics.removeMax();
      if (max === undefined) break;
      output.push(max);
    }
    output.forEach(item => this.topics.insert(item));
    const result = output.map(topicId => this.topicsMap[topicId]);
    return result;
  };

  // O(S)
  notifyTopic = topicId => {
    (this.topicSubscriptions[topicId] || [])
      .map(subId => this.subscriptions[subId])
      .forEach(callback => callback(this.topicsMap[topicId]));
  };

  // O(log(n) + S)
  notifyLatestTopics = () => {
    const topics = this.getLatestTopics();
    this.latestTopicSubscriptions
      .map(subId => this.subscriptions[subId])
      .forEach(callback => callback(topics));
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
