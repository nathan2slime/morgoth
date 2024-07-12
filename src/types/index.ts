import { Types, Document, Query } from 'mongoose';

export type Entity<T> = Document<unknown, object, T> &
  T & { _id: Types.ObjectId };
export type EntityQuery<T, F> = Query<unknown, unknown, object, T, F, object>;
