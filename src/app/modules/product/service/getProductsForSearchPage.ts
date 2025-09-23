import { decompressBase64UrlToObject } from "@utils/compression";
import { getProducts } from "./getProducts";

export const getProductsForSearchPage = async (
  queryObj: Record<string, any>
) => {
  const { q, ...rest } = queryObj;

  let decompressedParams = {};

  if (q) {
    const result = await decompressBase64UrlToObject(q as string);
    decompressedParams = result ?? {};
  }

  const defaultFields =
    "defaultOldPrice,defaultImage,defaultPrice,title,slug,brand";

  const newQueryObj = {
    ...rest,
    ...decompressedParams,
    limitFields:
      typeof rest.limitFields === "string" ? rest.limitFields : defaultFields,
    limit: rest.limit ?? 16,
  };

  return await getProducts(newQueryObj);
};
