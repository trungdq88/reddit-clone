export default class TopicDatabase {
  topics = [];
  subscriptions = {
    // subscriptionId => callback
  };

  add = value => {
    this.topics = this.topics.concat(value);
    this.notify();
  };

  notify = () => {
    // TODO: this implementation do not guarantee subscrition order.
    Object.values(this.subscriptions)
      .filter(callback => callback !== null)
      .forEach(callback => callback(this.topics));
  };

  subscribe = callback => {
    const subscriptionId = Math.random();
    // TODO: check duplicate subscriptionId.
    this.subscriptions[subscriptionId] = callback;
    return {
      id: subscriptionId,
      dispose: () => (this.subscriptions[subscriptionId] = null),
    };
  };
}
