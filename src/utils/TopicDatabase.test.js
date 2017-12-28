import TopicDatabase from './TopicDatabase.js';

describe('TopicDatabase.js', () => {
  it('should init with empty list', () => {
    expect(new TopicDatabase().topics).toEqual([]);
  });

  it('should receive subscription with subscription id when subscribe', () => {
    const db = new TopicDatabase();
    const subscrition1 = db.subscribeLatestTopic(() => {});
    expect(subscrition1.id).toBe(1);
    const subscrition2 = db.subscribeLatestTopic(() => {});
    expect(subscrition2.id).toBe(2);
  });

  it('should trigger callback when subscribe', () => {
    const db = new TopicDatabase();
    const callback = jest.fn();
    const subscription = db.subscribeLatestTopic(callback);
    db.add(123);
    expect(callback).toBeCalledWith([
      { id: 1, content: 123, upvote: 0, downvote: 0 },
    ]);
  });

  it('should not trigger callback when disposed', () => {
    const db = new TopicDatabase();
    const callback = jest.fn();
    const subscription = db.subscribeLatestTopic(callback);
    expect(callback).toBeCalledWith([]);
    subscription.dispose();
    db.add(456);
    expect(callback).not.toBeCalledWith([456]);
  });

  it('should add value', () => {
    const db = new TopicDatabase();
    db.add(456);
    expect(db.topics).toEqual([
      { content: 456, id: 1, upvote: 0, downvote: 0 },
    ]);
  });

  it('should init topics with constructor', () => {
    const db = new TopicDatabase([1, 2, 3]);
    expect(db.topics).toEqual([1, 2, 3]);
  });

  it('should return newly created topic after add', () => {
    const db = new TopicDatabase();
    const topic = db.add(456);
    expect(topic).toEqual({ id: 1, content: 456, upvote: 0, downvote: 0 });
  });

  it('should trigger callback on subscribe topic', () => {
    const db = new TopicDatabase();
    const topic = db.add(456);
    const callback = jest.fn();
    db.subscribeTopic(topic.id, callback);
    db.upvote(topic.id);
    expect(callback.mock.calls).toEqual([
      [{ id: 1, content: 456, upvote: 0, downvote: 0 }],
      [{ id: 1, content: 456, upvote: 1, downvote: 0 }],
    ]);
  });

  it('should work properly on multiple topic subscriptions', () => {
    const db = new TopicDatabase();
    const topic = db.add(456);
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const sub1 = db.subscribeTopic(topic.id, callback1);
    db.upvote(topic.id);
    const sub2 = db.subscribeTopic(topic.id, callback2);
    db.downvote(topic.id);
    sub1.dispose();
    db.downvote(topic.id);
    sub2.dispose();
    db.downvote(topic.id);
    db.upvote(topic.id);
    expect(callback1.mock.calls).toEqual([
      [{ id: 1, content: 456, upvote: 0, downvote: 0 }],
      [{ id: 1, content: 456, upvote: 1, downvote: 0 }],
      [{ id: 1, content: 456, upvote: 1, downvote: 1 }],
    ]);
    expect(callback2.mock.calls).toEqual([
      [{ id: 1, content: 456, upvote: 1, downvote: 0 }],
      [{ id: 1, content: 456, upvote: 1, downvote: 1 }],
      [{ id: 1, content: 456, upvote: 1, downvote: 2 }],
    ]);
  });

  it('should return new object for each subscription trigger', () => {
    const db = new TopicDatabase();
    const topic = db.add(456);
    const callback = jest.fn();
    db.subscribeLatestTopic(callback);
    db.upvote(topic.id);
    expect(callback.mock.calls[0][0] === callback.mock.calls[1][0]).toBe(false);
  });

  it('should always return top 20 topics', () => {
    const db = new TopicDatabase([], 20);
    for (let i = 0; i < 100; i++) {
      db.add(i + 1);
      for (let j = 0; j < i; j++) {
        db.upvote(i + 1);
      }
    }
    const callback = jest.fn();
    db.subscribeLatestTopic(callback);
    expect(callback.mock.calls[0][0].length).toEqual(20);
    expect(callback.mock.calls[0][0].map(_ => _.upvote)).toEqual([
      99,
      98,
      97,
      96,
      95,
      94,
      93,
      92,
      91,
      90,
      89,
      88,
      87,
      86,
      85,
      84,
      83,
      82,
      81,
      80,
    ]);
    // Upvote topic id 100 three more times
    db.upvote(100);
    db.upvote(100);
    db.upvote(100);
    expect(callback.mock.calls[1][0].map(_ => _.upvote)[0]).toEqual(100);
    expect(callback.mock.calls[2][0].map(_ => _.upvote)[0]).toEqual(101);
    expect(callback.mock.calls[3][0].map(_ => _.upvote)[0]).toEqual(102);
  });

  it('should sort by upvote-downvote desc, then by id desc', () => {
    const db = new TopicDatabase();
    for (let i = 0; i < 10; i++) {
      db.add(i + 1);
    }
    const callback = jest.fn();
    db.subscribeLatestTopic(callback);
    expect(callback.mock.calls[0][0].map(_ => _.id)).toEqual([
      10,
      9,
      8,
      7,
      6,
      5,
      4,
      3,
      2,
      1,
    ]);
  });
});
