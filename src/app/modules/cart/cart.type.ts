import { HydratedDocument, Model, Types } from "mongoose";
import { IProduct, IVariant } from "../product/product.type";

export interface ICartItem<P = Types.ObjectId, V = Types.ObjectId> {
  product: P;
  variant: V;
  quantity: number;
}

// unpopulated cart item:
export type TDatabaseCartItem = ICartItem<Types.ObjectId, Types.ObjectId>;

// Populated cart item:
export type TPopulatedCartItem = ICartItem<
  Partial<IProduct>,
  Partial<IVariant>
>;

export interface ICart<C> {
  _id?: Types.ObjectId;
  user: Types.ObjectId | "guest";
  items: C[];
  couponCode?: string;
  discount?: number;
  tax?: number;
  shippingFee?: number;
  createdAt?: Date;
  updatedAt?: Date;
  subtotal?: number;
  totalItemQty?: number;
  total?: number;
}

export interface ICartAction {
  productId: string;
  variantId: string;
  action: "add" | "remove";
  quantity: number;
}

export type TDatabaseCart = ICart<TDatabaseCartItem>;
export type TPopulatedCart = ICart<TPopulatedCartItem>;
export type TDatabaseCartDoc = HydratedDocument<TDatabaseCart>;

export interface IDatabaseCartModel extends Model<TDatabaseCart> {
  getPopulatedCart(id: Types.ObjectId): TPopulatedCart;
}
