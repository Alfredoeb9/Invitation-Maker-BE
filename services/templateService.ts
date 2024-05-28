import fs from "fs-extra";
import Handlebars from "handlebars";
let path = require("path");
path = path.join(__dirname, "../templates");

const forgotPasswordTemplateSource = fs.readFileSync(
  `${path}/forgotPassword.html`,
  { encoding: "utf8" }
);

const getForgotTemplate = Handlebars.compile(forgotPasswordTemplateSource);

export { getForgotTemplate };
