export default class TopicDatabase {
  _subscriptionIdIterator = 0;
  _topicIdIterator = 0;
  maxRecentCount = null;
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

  /**
   * @constructor
   * @param {array} topics - Initial topics, useful to restore from a persistent database if any.
   * @param {number} maxRecentCount - Number of top topics returns to subscriptions, sorted by upvotes, descending order.
   * @return {TopicDatabase}
   */
  constructor(topics, maxRecentCount) {
    this.topics = topics || [];
    this.maxRecentCount = maxRecentCount || null;
  }

  /**
   * Create new topic with content string.
   *
   * @param {string} content - Create new topic with content string.
   * @return {object} - return Topic object
   * @public
   */
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

  /**
   * Increase topic upvote by 1 point
   *
   * @param {number} topicId - Topic id
   * @public
   */
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

  /**
   * Increase topic downvote by 1 point
   *
   * @param {number} topicId - Topic id
   * @public
   */
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

  /**
   * Sort the topics by upvote then topic id, descending order
   *
   * @private
   */
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

  /**
   * Return latest topics sorted by upvotes descending order
   *
   * @return {array} - array of `maxRecentCount` topics
   * @public
   */
  getLatestTopics = () =>
    // Notice: .slice will create new array
    this.topics.slice(
      0,
      this.maxRecentCount !== null ? this.maxRecentCount : this.topics.length,
    );

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

  /**
   * Subscribe to latest topics
   *
   * @params {function} callback - which will be triggered when latest topics change (added, removed, modified). Params: array of Topic. Callback will be call the first time immediately after subscribe.
   * @return {object} - Subscription object with `id` property and `dispose()` method. Calling `dispose()` will stop the subscription.
   * @public
   */
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

  /**
   * Subscribe to a topic
   *
   * @params {number} topicId - Topic ID to subscribe to
   * @params {function} callback - callback which will be triggered when the topic properties change (upvote or downvote). Params: Topic object. Callback will be call the first time immediately after subscribe.
   * @return {object} - Subscription object with `id` property and `dispose()` method. Calling `dispose()` will stop the subscription.
   * @public
   */
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
