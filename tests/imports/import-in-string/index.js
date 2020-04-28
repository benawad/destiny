import module from "./module";

// prettier-ignore
module("import test from \"./test1\"");
// prettier-ignore
module('import test from "./test2"');
// prettier-ignore
module(`import test from "./test3"`);

// prettier-ignore
module('import test from \'./test4\'');
// prettier-ignore
module("import test from './test5'");
// prettier-ignore
module(`import test from './test6'`);

// prettier-ignore
module(`import test from \`./test7\``);
// prettier-ignore
module("import test from `./test8`");
// prettier-ignore
module('import test from `./test9`');

// prettier-ingore
module(`
  this is just

  import test "./test10"
  a random multi lines string

  which contain an es6 import
`);

// prettier-ignore
module("const test = require(\"./test11\")");
// prettier-ignore
module('const test = require("./test12")');
// prettier-ignore
module(`const test = require("./test13")`);

// prettier-ignore
module('const test = require(\'./test14\')');
// prettier-ignore
module("const test = require('./test15')");
// prettier-ignore
module(`const test = require('./test16')`);

// prettier-ignore
module(`const test = require(\`./test17\`)`);

// prettier-ignore
module(`const test = require(\`./test18\`)`);
// prettier-ignore
module("const test = require(./test19`)");
// prettier-ignore
module('const test = require(./test20`)');

// prettier-ingore
module(`
  this is just

  const test = require("./test21")
  a random multi lines string

  which contain an es5 import
`);
