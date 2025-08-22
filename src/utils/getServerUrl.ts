import { config } from "@config/env";
import { Request } from "express";

export const getServerUrl = (req: Request): string => {
  const protocol = req.protocol;
  const host = req.get("host");

  return `${protocol}://${host}/api/${config.apiVersion}`;
};
