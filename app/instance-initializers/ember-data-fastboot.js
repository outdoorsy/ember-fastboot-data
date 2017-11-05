import { isEmpty } from '@ember/utils';
import { debug } from '@ember/debug';

export function initialize(applicationInstance) {
  let shoebox = applicationInstance.lookup('service:fastboot').get('shoebox');
  if (!shoebox) { return; }
  let dump = shoebox.retrieve('ember-data-store');
  if (!dump) { return; }
  let store = applicationInstance.lookup('service:store');

  Object.keys(dump.records).forEach(modelName => {
    let recordsToPush = {};
    recordsToPush[modelName] = dump.records[modelName];
    if (isEmpty(recordsToPush[modelName])) { return; }

    if (Object.keys(recordsToPush[modelName]).includes('data')) {
      store.pushPayload(modelName, recordsToPush[modelName]);
      return;
    }

    let normalizeData = recordsToPush[modelName].map(o => store.normalize(modelName, o).data);
    return store.push({ data: normalizeData });
  });
}

export default {
  name: 'ember-data-fastboot',
  initialize() {
    if (typeof FastBoot === 'undefined') {
      initialize(...arguments);
    }
  }
};
