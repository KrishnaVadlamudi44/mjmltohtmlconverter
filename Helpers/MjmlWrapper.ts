import mjml2html from "mjml";
import Handlebars from "handlebars";
import { minify } from "html-minifier";

/*
 * Helper function to create rows with specified number of columns
 */
Handlebars.registerHelper("eachRow", function (items, numColumns, options) {
  let result = "";

  for (let i = 0; i < items.length; i += numColumns) {
    let columns = items.slice(i, i + numColumns);
    if (options.hash.usePlaceholders && columns.length < numColumns) {
      columns = columns.concat(
        Array(numColumns - columns.length).fill({ isPlaceholder: true })
      );
    }
    result += options.fn({
      columns,
    });
  }

  return result;
});

/*
 * Helper function to check if params are equal
 */
Handlebars.registerHelper(
  "equals",
  function (this: any, string1, string2, options) {
    if (string1 === string2) {
      return options.fn(this);
    }
    return options.inverse(this);
  }
);

/*
  Helper function to display current year
*/
Handlebars.registerHelper("displayYear", function () {
  return new Date().getFullYear();
});

/*
  Helper function to get fonts css file
*/
Handlebars.registerHelper("getFont", (font: string) => {
  return `https://fonts.googleapis.com/css2?family=${font
    .replace(" ", "+")
    .trim()}:wght@400;600;700;800`;
});

export interface Options {
  validationLevel?: "strict" | "soft" | "skip" | undefined;
  minify: boolean;
  collapseWhitespace: boolean;
  minifyCSS: boolean;
  removeEmptyAttributes: boolean;
}

export class MjmlEmailMapper<T> {
  private readonly template: HandlebarsTemplateDelegate<T>;
  options: Options;

  constructor(template: HandlebarsTemplateDelegate<T>) {
    this.template = template;
    this.options = {
      validationLevel: "strict",
      minify: true,
      collapseWhitespace: true,
      minifyCSS: true,
      removeEmptyAttributes: true,
    };
  }

  toHtml(context: T): string {
    const mjmlTemplate = this.template(context);
    const mjmlOutput = mjml2html(mjmlTemplate, {
      validationLevel: this.options.validationLevel,
    });

    if (mjmlOutput?.errors && mjmlOutput.errors.length > 0) {
      throw new Error(
        `Unable to generate HTML: ${mjmlOutput.errors.join(", ")}`
      );
    }

    let result = mjmlOutput.html;

    if (this.options.minify) {
      result = minify(mjmlOutput.html, {
        collapseWhitespace: this.options.collapseWhitespace,
        minifyCSS: this.options.minifyCSS,
        removeEmptyAttributes: this.options.removeEmptyAttributes,
      });
    }

    return result;
  }
}
