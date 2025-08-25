import { readFile } from "fs/promises";
import { resolveFromRoot } from "./resolveFromRoot";
import Handlebars from "handlebars";

export const generateEmailTemplate = async (
  templateRelativePath: string,
  data: Record<string, any>
): Promise<string> => {
  Handlebars.registerHelper("multiply", function (a: number, b: number) {
    return (a * b).toFixed(2);
  });
  const absolutePath = resolveFromRoot(templateRelativePath);
  const templateContent = await readFile(absolutePath, "utf-8");
  const template = Handlebars.compile(templateContent);
  return template(data);
};
