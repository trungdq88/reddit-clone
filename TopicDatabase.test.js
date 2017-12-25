import TopicDatabase from './TopicDatabase.js';

describe('TopicDatabase.js', () => {
  it('should init with empty list', () => {
    expect(new TopicDatabase().topics).toEqual([]);
  });

  it('should receive subscription with subscription id when subscribe', () => {
    const db = new TopicDatabase();
    const subscrition1 = db.subscribe();
    expect(subscrition1.id).toBe(1);
    const subscrition2 = db.subscribe();
    expect(subscrition2.id).toBe(2);
  });

  it('should trigger callback when subscribe', () => {
    const db = new TopicDatabase();
    const callback = jest.fn();
    const subscription = db.subscribe(callback);
    db.add(123);
    expect(callback).toBeCalledWith([123]);
  });

  it('should not trigger callback when disposed', () => {
    const db = new TopicDatabase();
    const callback = jest.fn();
    const subscription = db.subscribe(callback);
    subscription.dispose();
    db.add(456);
    expect(callback).not.toBeCalled();
  });

  it('should add value', () => {
    const db = new TopicDatabase();
    db.add(456);
    expect(db.topics).toEqual([456]);
  });
});