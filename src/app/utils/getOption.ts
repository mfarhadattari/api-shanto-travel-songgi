export interface IOptions {
  limit: number;
  page: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}

const getOptions = (query: Record<string, unknown>): IOptions => {
  const limit = Number(query.limit) || 10;
  const page = Number(query.page) || 1;
  const skip = (page - 1) * limit;
  const sortBy = (query.sortBy as string) || 'createdAt';
  const sortOrder = (query.sortOrder as string) || 'desc';

  return {
    limit,
    page,
    skip,
    sortBy,
    sortOrder,
  };
};

export default getOptions;
