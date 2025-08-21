import mongoose from "mongoose";

/**
 * Compose a schema-specific transform with global mongoose transform.
 */
export const composeMongooseTransform = (schemaTransform?: Function) => {
  // Get global toJSON
  const globalToJSON = mongoose.get("toJSON");
  const globalTransform =
    globalToJSON &&
    typeof globalToJSON === "object" &&
    typeof globalToJSON.transform === "function"
      ? globalToJSON.transform
      : undefined;

  return (doc: any, ret: any, options: any) => {
    // apply global transform first if it exists
    if (globalTransform) ret = globalTransform(doc, ret, options);

    // then schema-specific
    if (schemaTransform) ret = schemaTransform(doc, ret, options);

    return ret;
  };
};
