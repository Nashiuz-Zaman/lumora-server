import { Model, Types, HydratedDocument } from "mongoose";

export interface IPopulateOptions {
  path: string;
  select?: string;
}

export class QueryBuilderOne<T> {
  private model: Model<T>;
  private queryObj: Record<string, any>;
  private filterObj: Record<string, any> = {};
  private selectedFields: string | null = null;
  private population: (string | IPopulateOptions)[] = [];

  constructor(model: Model<T>, queryObj: Record<string, any>) {
    this.model = model;
    this.queryObj = queryObj;
  }

  filter(additionalFields: string[] = []): this {
    const query = { ...this.queryObj };
    const exclude = [
      "sort",
      "limitFields",
      "search",
      "populate",
      ...additionalFields,
    ];
    exclude.forEach((f) => delete query[f]);

    let queryStr = JSON.stringify(query).replace(
      /\b(gte|gt|lte|lt|ne|in|nin|regex)\b/g,
      (op) => `$${op}`
    );

    const mongoQuery = JSON.parse(queryStr);

    // Convert values to ObjectId, array, or boolean
    for (const key in mongoQuery) {
      const val = mongoQuery[key];
      if (typeof val === "string" && Types.ObjectId.isValid(val)) {
        mongoQuery[key] = new Types.ObjectId(val);
      } else if (typeof val === "object" && val !== null) {
        for (const op in val) {
          if (["$in", "$nin"].includes(op) && typeof val[op] === "string") {
            val[op] = val[op].split(",");
          }
        }
      } else if (val === "true" || val === "false") {
        mongoQuery[key] = val === "true";
      }
    }

    this.filterObj = mongoQuery;
    return this;
  }

  search(searchableFields: string[]): this {
    const searchText = this.queryObj.search;
    if (!searchText || !searchableFields?.length) return this;

    const orConditions = searchableFields.map((field) => ({
      [field]: { $regex: searchText, $options: "i" },
    }));

    this.filterObj =
      Object.keys(this.filterObj).length > 0
        ? { $and: [this.filterObj, { $or: orConditions }] }
        : { $or: orConditions };

    return this;
  }

  limitFields(): this {
    if (this.queryObj.limitFields) {
      this.selectedFields = this.queryObj.limitFields
        .split(",")
        .map((f: string) => f.trim())
        .join(" ");
    }
    return this;
  }

  populate(
    path?: string | IPopulateOptions | (string | IPopulateOptions)[]
  ): this {
    if (!path && this.queryObj.populate) {

      const rawPopulate = this.queryObj.populate;
      
      if (typeof rawPopulate === "string") {
        (rawPopulate.split(",").map((p) => p.trim()) || []).forEach(
          (p) => p && this.population.push({ path: p })
        );
      } else if (Array.isArray(rawPopulate)) {
        this.population.push(...rawPopulate);
      } else if (typeof rawPopulate === "object" && rawPopulate.path) {
        this.population.push(rawPopulate);
      }
      return this;
    }

    if (Array.isArray(path)) {
      this.population.push(...path);
    } else if (path) {
      this.population.push(path);
    }

    return this;
  }

  async exec(): Promise<HydratedDocument<T> | null> {
    let query = this.model.findOne(this.filterObj);

    for (const pop of this.population) {
      query = query.populate(pop as any);
    }

    if (this.selectedFields) {
      query = query.select(this.selectedFields);
    }

    return query.exec();
  }
}
