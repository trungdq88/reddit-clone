export default class TopicDatabase {
  _idIterator = 0;
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

  subscribe = (callback, generator) => {
    const subscriptionId = ++this._idIterator;
    this.subscriptions[subscriptionId] = callback;
    return {
      id: subscriptionId,
      dispose: () => (this.subscriptions[subscriptionId] = null),
    };
  };
}
