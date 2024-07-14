import * as mongoose from 'mongoose';

import { SortOrder } from '~/types/filter.enum';

type PaginationArgs = {
  page: number;
  perPage: number;
  sortOrder: SortOrder;
  query: string;
  sortField: string | undefined;
};
export const paginate = async <T>(
  model: mongoose.Model<T>,
  query: mongoose.FilterQuery<T>,
  args: PaginationArgs,
) => {
  const orders: Record<SortOrder, mongoose.SortOrder> = {
    [SortOrder.ASC]: 1,
    [SortOrder.DESC]: -1,
  };

  const total = await model.countDocuments(query);
  const items = await model
    .find(query)
    .sort({ [args.sortField]: orders[args.sortOrder] })
    .skip((args.page - 1) * args.perPage)
    .limit(args.perPage);

  const pages = Math.ceil(total / args.perPage);

  return { page: args.page, items, pages, total, perPage: args.perPage };
};
