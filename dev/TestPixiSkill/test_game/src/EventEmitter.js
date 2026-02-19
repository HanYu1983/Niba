// 觀察者模式的事件系統
export function createEventEmitter() {
  const listeners = {};

  return {
    // 註冊事件監聽器
    on(eventName, callback) {
      if (!listeners[eventName]) {
        listeners[eventName] = [];
      }
      listeners[eventName].push(callback);
    },

    // 發射事件
    emit(eventName, ...args) {
      if (listeners[eventName]) {
        listeners[eventName].forEach(callback => callback(...args));
      }
    },

    // 移除事件監聽器
    off(eventName, callback) {
      if (listeners[eventName]) {
        listeners[eventName] = listeners[eventName].filter(cb => cb !== callback);
      }
    },

    // 清除所有監聽器
    clear() {
      Object.keys(listeners).forEach(key => {
        listeners[key] = [];
      });
    }
  };
}
