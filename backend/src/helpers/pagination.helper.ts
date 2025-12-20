import { Model, PipelineStage, Types } from "mongoose";

export interface CursorPaginationParams {
  model: Model<any>;
  limit?: number;
  cursor?: string | null;
  match?: Record<string, any>;
  pipeline?: PipelineStage[];
}

export const cursorPagination = async ({
  model,
  cursor,
  limit = 15,
  match = {},
  pipeline = [],
}: CursorPaginationParams) => {
  const parsedLimit = Math.min(limit, 100);

  const matchStage: PipelineStage.Match = {
    $match: { ...match },
  };

  if (cursor) {
    matchStage.$match._id = { $lt: new Types.ObjectId(cursor) };
  }

  const basePipeline: PipelineStage[] = [
    matchStage,
    ...pipeline,
    { $sort: { _id: -1 } },
    { $limit: parsedLimit + 1 },
  ];

  const results = await model.aggregate(basePipeline);

  const hasNext = results.length > parsedLimit;
  const items = results.slice(0, parsedLimit);
  const nextCursor = hasNext ? items[items.length - 1]._id.toString() : null;
  return {
    items,
    nextCursor,
    hasNext
  }
};
