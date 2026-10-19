const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
fs.mkdirSync(path.join(root,'docs'),{recursive:true});
for (const name of ['index.html','style.css','theme.js','i18n.js','app.js']) {
  fs.copyFileSync(path.join(root,'public',name),path.join(root,'docs',name));
}
fs.writeFileSync(path.join(root,'docs','.nojekyll'),'');
console.log('GitHub Pages files prepared in docs/');
