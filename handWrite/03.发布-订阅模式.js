class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  emit(eventName, ...args) {
    if (!this.events[eventName]) return;

    this.events[eventName].forEach((callback) => {
      callback.apply(this, args);
    });
  }

  off(eventName, callback) {
    if (!this.events[eventName]) return;

    this.events[eventName] = this.events[eventName].filter(
      (fn) => fn !== callback,
    );
  }

  once(eventName, callback) {
    const wrapper = (...args) => {
      callback.apply(this, args);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }
}
