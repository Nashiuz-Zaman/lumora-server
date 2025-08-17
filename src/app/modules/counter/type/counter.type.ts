import { HydratedDocument } from "mongoose";

export interface ICounter {
  _id: string;
  seq: number;
}

export type TCounterDoc = HydratedDocument<ICounter>;
