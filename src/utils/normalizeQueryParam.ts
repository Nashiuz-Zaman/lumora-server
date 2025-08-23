export const normalizeNumberField = (
  query: Record<string, any>,
  field: string
) => {
  if (field in query) {
    const val = Number(query[field]);

    if (!isNaN(val)) {
      query[field] = val;
    }
  }

  return query;
};

export const normalizeStatusFilter = <
  T extends { status?: any } & Record<string, any>
>(
  queryObj: T,
  fallback?: Record<string, any>
): T => {
  const newQueryObj = { ...queryObj };

  if (newQueryObj.status === "all" || newQueryObj.status === undefined) {
    if (fallback) {
      newQueryObj.status = fallback;
    } else {
      delete newQueryObj.status;
    }
  } else {
    return normalizeNumberField(newQueryObj, "status") as T;
  }

  return newQueryObj;
};
