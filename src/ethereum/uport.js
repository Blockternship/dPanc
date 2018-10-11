var instance;

const funcs = {
  saveInstance(_instance) {
    instance = _instance;
  },
  getProvider() {
    if (instance)
      return instance.getProvider();
    return null;
  }
}

export default funcs;
