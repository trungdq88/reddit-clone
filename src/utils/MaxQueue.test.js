import MaxQueue from './MaxQueue.js';

describe('max-queue.js', () => {
  it('should removeMax', () => {
    const a = new MaxQueue([3, 2, 1]);
    a.removeMax();
    expect(a.tree).toEqual([2, 1]);
  });

  it('should removeMax', () => {
    const a = new MaxQueue([9, 8, 7, 6, 5, 6, 4, 1]);
    a.removeMax();
    expect(a.tree).toEqual([8, 6, 7, 1, 5, 6, 4]);
    a.removeMax();
    expect(a.tree).toEqual([7, 6, 6, 1, 5, 4]);
  });

  it('should insert', () => {
    const a = new MaxQueue([7, 5, 3, 3, 4, 2]);
    a.insert(2);
    expect(a.tree).toEqual([7, 5, 3, 3, 4, 2, 2]);
    a.insert(8);
    expect(a.tree).toEqual([8, 7, 3, 5, 4, 2, 2, 3]);
  });

  it('should insert', () => {
    const a = new MaxQueue([8, 5, 4, 4, 3, 6]);
    a.insert(7);
    expect(a.tree).toEqual([8, 5, 7, 4, 3, 6, 4]);
  });

  it('should insert with comparator', () => {
    const a = new MaxQueue([
      { x: 7 },
      { x: 5 },
      { x: 3 },
      { x: 3 },
      { x: 4 },
      { x: 2 },
    ]);
    a.insert({ x: 2 });
    expect(a.tree).toEqual([
      { x: 7 },
      { x: 5 },
      { x: 3 },
      { x: 3 },
      { x: 4 },
      { x: 2 },
      { x: 2 },
    ]);
  });

  it('should do the heap sort', () => {
    const input = [8, 5, 7, 4, 3, 6, 4];
    const queue = new MaxQueue();
    input.forEach(value => queue.insert(value));
    const output = [];
    input.forEach(() => output.push(queue.removeMax()));
    expect(output).toEqual([8, 7, 6, 5, 4, 4, 3]);
  });

  it('should get first 4 items and keep original queue', () => {
    const queue = new MaxQueue([8, 5, 7, 4, 3, 6, 4]);
    const output = [];
    for (let i = 0; i < 4; i++) {
      output.push(queue.removeMax());
    }
    output.forEach(item => queue.insert(item));
    expect(output).toEqual([8, 7, 6, 5]);
    expect(queue.tree.length).toEqual(7);

    const output2 = [];
    for (let i = 0; i < 4; i++) {
      output2.push(queue.removeMax());
    }
    output2.forEach(item => queue.insert(item));
    expect(output2).toEqual([8, 7, 6, 5]);
  });

  it('should get first 10 items and keep original queue', () => {
    const queue = new MaxQueue([8, 5, 7, 4, 3, 6, 4]);
    const output = [];
    for (let i = 0; i < 10; i++) {
      const max = queue.removeMax();
      if (max === undefined) return;
      output.push(max);
    }
    output.forEach(item => queue.insert(item));
    expect(output).toEqual([8, 7, 6, 5, 4, 4, 3]);
    expect(queue.tree.length).toEqual(7);
  });
});
