export function initialize(applicationInstance) {
  let store = applicationInstance.lookup('service:store');
  let shoebox = applicationInstance.lookup('service:fastboot').get('shoebox');
  const modelNames = applicationInstance.lookup('data-adapter:main').getModelTypes().mapBy('name');

  shoebox.put('ember-data-store', {
    get records() {
      let serializedRecords = {};

      modelNames.map(name => {
        serializedRecords[name] = [];
        return store.peekAll(name).toArray();
      }).reduce((a,b) => a.concat(b), [])
        .filter(record => record.get('isLoaded') && !record.get('isNew'))
        .forEach(record => {
          let modelName = record._internalModel.modelName;
          let serialized = record.serialize({ includeId: true });

          if (Object.keys(serialized).includes('data')) {
            if (serializedRecords[modelName].length === 0) {
              serializedRecords[modelName] = { data: [] };
            }
            serializedRecords[modelName]['data'].push(serialized.data);
          } else {
            serializedRecords[modelName].push(serialized);
          }
        });

      return serializedRecords;
    }
  });
}

export default {
  name: 'ember-data-fastboot',
  initialize
};
