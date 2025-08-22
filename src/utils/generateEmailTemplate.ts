import { readFile } from "fs/promises";
import { resolveFromRoot } from "./resolveFromRoot";
import Handlebars from "handlebars";

/**
 * Reads a Handlebars template file and compiles it with given data.
 * @param templateRelativePath - path to template relative to project root, e.g. "templates/email-verification.hbs"
 * @param data - object containing variables to replace in the template
 * @returns Rendered template string
 */
export const generateEmailTemplate = async (
  templateRelativePath: string,
  data: Record<string, any>
): Promise<string> => {
  Handlebars.registerHelper("multiply", function (a: number, b: number) {
    return (a * b).toFixed(2); // Keeps it consistent as a currency
  });
  const absolutePath = resolveFromRoot(templateRelativePath);
  const templateContent = await readFile(absolutePath, "utf-8");
  const template = Handlebars.compile(templateContent);
  return template(data);
};
