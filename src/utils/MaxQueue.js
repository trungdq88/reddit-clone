export default class MaxQueue {
  constructor(tree, comparator) {
    this.tree = tree || [];
    this.comparator = comparator;
  }

  getMax() {
    return tree[0];
  }

  insert(value) {
    this.tree.push(value);
    this.bubble(this.tree.length - 1);
  }

  removeMax() {
    const max = this.tree[0];
    // Move the last node to root
    this.tree[0] = this.tree[this.tree.length - 1];
    // Delete the last node
    delete this.tree[this.tree.length - 1];
    this.tree.length = this.tree.length - 1;
    this.reindex(0);
    return max;
  }

  bubble(n) {
    if (n === 0) return;
    const fatherIndex = Math.floor((n - 1) / 2);
    if (this.lessThan(this.tree[fatherIndex], this.tree[n])) {
      this.swap(fatherIndex, n);
      this.bubble(fatherIndex);
    }
  }

  lessThan(a, b) {
    return this.comparator ? this.comparator(a, b) : a < b;
  }

  reindex(n) {
    const leftIndex = 2 * n + 1;
    const rightIndex = 2 * n + 2;
    const left = this.tree[leftIndex];
    const right = this.tree[rightIndex];
    const exists = index => index < this.tree.length;
    if (
      exists(leftIndex) &&
      this.lessThan(this.tree[n], left) &&
      (!exists(rightIndex) || !this.lessThan(left, right))
    ) {
      this.swap(n, leftIndex);
      this.reindex(leftIndex);
    } else if (
      exists(rightIndex) &&
      this.lessThan(this.tree[n], right) &&
      !this.lessThan(right, left)
    ) {
      this.swap(n, rightIndex);
      this.reindex(rightIndex);
    }
  }

  swap(a, b) {
    const t = this.tree[a];
    this.tree[a] = this.tree[b];
    this.tree[b] = t;
  }
}
