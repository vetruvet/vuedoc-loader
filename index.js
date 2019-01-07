const util = require('util');
const fs = require('fs');
const vueDoc = require('@vuedoc/parser');

// To avoid parsing entire .vue file, use a regex for the simple src="..." case
// @vuedoc/parser will parse the output anyway, so I don't want to do it twice
// Using regex for XML "parsing"... sue me
// TODO ignore other attributes that may be present
const TEMPLATE_SRC_REGEX = /<template\s+src=(?:'|")?([^'"]+)(?:'|")?\s*>\s*<\/template>/i;
const SCRIPT_SRC_REGEX = /<script\s+src=(?:'|")?([^'"]+)(?:'|")?\s*>\s*<\/script>/i;

module.exports = async function(source) {
  const callback = this.async();

  try {
    let inlinedSource = source;

    const [externalTemplateTag, externalTemplateSrc] = TEMPLATE_SRC_REGEX.exec(source) || [];
    const [externalScriptTag, externalScriptSrc] = SCRIPT_SRC_REGEX.exec(source) || [];

    if (externalTemplateSrc) {
      const templatePath = await util.promisify(this.resolve)(this.context, externalTemplateSrc);

      this.addDependency(templatePath);

      const template = fs.readFileSync(templatePath);

      inlinedSource = inlinedSource.replace(externalTemplateTag, `<template>${template}</template>`);
    }

    if (externalScriptSrc) {
      const scriptPath = await util.promisify(this.resolve)(this.context, externalScriptSrc);

      this.addDependency(scriptPath);

      const script = fs.readFileSync(scriptPath);

      inlinedSource = inlinedSource.replace(externalScriptTag, `<script>${script}</script>`);
    }

    const component = await vueDoc.parse({ filecontent: inlinedSource });

    callback(null, `export default ${JSON.stringify(component)}`);
  } catch (err) {
    callback(err);
  }
}
