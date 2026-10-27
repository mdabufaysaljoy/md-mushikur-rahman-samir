import mongoose from 'mongoose';
import { config } from '../config.js';
import { fileStore } from './fileStore.js';

export const state = { driver: 'file' };

export async function connectDatabase() {
  if (!config.mongoUri) {
    console.warn('[db] MONGODB_URI empty -> using JSON file store');
    return state.driver;
  }
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 2500 });
    state.driver = 'mongo';
    console.log('[db] connected to MongoDB');
  } catch (err) {
    state.driver = 'file';
    console.warn(`[db] MongoDB unavailable (${err.message}) -> using JSON file store`);
  }
  return state.driver;
}

const plain = (doc) => (doc && doc.toObject ? doc.toObject({ versionKey: false }) : doc);

/** Same CRUD surface over Mongoose or the JSON store. */
export function repo(model) {
  const name = model.modelName.toLowerCase();
  return {
    name,
    async list(filter = {}, sort = { order: 1, createdAt: -1 }) {
      if (state.driver === 'mongo') return (await model.find(filter).sort(sort).lean()).map(plain);
      return fileStore.list(name, filter, sort);
    },
    async findOne(filter = {}) {
      if (state.driver === 'mongo') return plain(await model.findOne(filter).lean());
      return fileStore.findOne(name, filter);
    },
    async findById(id) {
      if (state.driver === 'mongo') {
        if (!mongoose.isValidObjectId(id)) return null;
        return plain(await model.findById(id).lean());
      }
      return fileStore.findOne(name, { _id: id });
    },
    async create(data) {
      if (state.driver === 'mongo') return plain(await model.create(data));
      return fileStore.create(name, data);
    },
    async update(id, data) {
      if (state.driver === 'mongo') {
        if (!mongoose.isValidObjectId(id)) return null;
        return plain(await model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean());
      }
      return fileStore.update(name, id, data);
    },
    async remove(id) {
      if (state.driver === 'mongo') {
        if (!mongoose.isValidObjectId(id)) return null;
        return plain(await model.findByIdAndDelete(id).lean());
      }
      return fileStore.remove(name, id);
    },
    async clear() {
      if (state.driver === 'mongo') return model.deleteMany({});
      return fileStore.replaceAll(name, []);
    },
    async count(filter = {}) {
      if (state.driver === 'mongo') return model.countDocuments(filter);
      return fileStore.list(name, filter).length;
    },
  };
}
