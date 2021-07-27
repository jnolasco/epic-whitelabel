// TODO add json schema validator to all inputs

export default class BaseAnalyzer {
  constructor() {
    this.telemetry = null;
  }

  anaylze(telemetry, task) {
    throw("Override this function in child class.");
  }
}
