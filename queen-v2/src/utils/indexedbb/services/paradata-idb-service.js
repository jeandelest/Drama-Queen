/* eslint-disable import/no-anonymous-default-export */
import AbstractIdbService from './abstract-idb-service';

class ParadataIdbService extends AbstractIdbService {
  constructor() {
    super('paradata');
  }
}

export default new ParadataIdbService();
