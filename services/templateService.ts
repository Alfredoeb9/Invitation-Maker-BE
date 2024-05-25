import path from "path";
import fs from "fs-extra";
import Handlebars from "handlebars";

path.join(__dirname, "../templates");

const forgotPasswordTemplateSource = fs.readFileSync(
  `${path}/forgotPassword.html`,
  { encoding: "utf8" }
);

const getForgotTemplate = Handlebars.compile(forgotPasswordTemplateSource);

export { getForgotTemplate };
