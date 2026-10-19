const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('public/i18n.js','utf8').replace('prepareLanguageOptions();','').replace('translatePage();','');
const context = vm.createContext({Intl,navigator:{language:'vi-VN'},localStorage:{getItem:()=>null}});
vm.runInContext(source,context);
assert.equal(vm.runInContext('siteLocale',context),'en');
assert.equal(vm.runInContext("chooseLocale(null,'pt-BR')",context),'pt');
assert.equal(vm.runInContext("chooseLocale(null,'fr-CA')",context),'fr');
assert.equal(vm.runInContext("chooseLocale('de','pt-PT')",context),'de');
assert.equal(vm.runInContext("chooseLocale('invalid','en-US')",context),'en');
vm.runInContext("siteLocale='pt'",context);
assert.equal(vm.runInContext("languageDetails('pt','PT BR').search.includes(normalizeSearch('Por'))",context),true);
assert.equal(vm.runInContext("languageDetails('de','DE AT CH').search.includes(normalizeSearch('Au'))",context),true);
assert.equal(vm.runInContext("languageDetails('en','US GB AU').search.includes(normalizeSearch('Austrália'))",context),true);
assert.equal(vm.runInContext("languageDetails('vi','VN').search.includes('viet')",context),true);
assert.equal(vm.runInContext("VIDEO_LANGUAGES.length",context),99);
for (const locale of ['en','pt','es','fr','de','it']) {
  vm.runInContext(`siteLocale='${locale}'`,context);
  assert.ok(vm.runInContext('Object.values(translations).every(row => typeof row[siteLocale] === "string" && row[siteLocale].length > 0)',context));
  assert.ok(vm.runInContext('VIDEO_LANGUAGES.every(([code,regions]) => languageDetails(code,regions).label.length > 0)',context));
}
console.log('Browser detection, English fallback, saved locale, six translations and 99 searchable languages OK');
