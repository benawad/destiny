import path from "path";
import glob from "glob";

import { toFractalTree } from "../src/index/generateTrees/toFractalTree";
import { buildGraph } from "../src/index/generateTrees/buildGraph";
import { findEntryPoints } from "../src/index/generateTrees/findEntryPoints";

const table: [string, { [key: string]: string }][] = [
  [
    "simple",
    {
      "index.js": "index.js",
      "routes.js": "index/routes.js",
      "home.js": "index/routes/home.js",
    },
  ],
  [
    "index-cycle",
    {
      "index.js": "index.js",
      "routes/index.js": "index/routes.js",
      "login/index.js": "index/login.js",
      "home/index.js": "index/routes/home.js",
      "utils/search.js": "index/login/search.js",
    },
  ],
  [
    "sharing",
    {
      "index.js": "index.js",
      "footer/index.js": "index/footer.js",
      "header/index.js": "index/header.js",
      "header/helper.js": "index/shared/helper.js",
    },
  ],
  [
    "spec-files",
    {
      "index.js": "index.js",
      "index.spec.js": "index.spec.js",
      "level1.js": "index/level1.js",
      "level1.spec.js": "index/level1.spec.js",
      "level2.js": "index/level1/level2.js",
      "level2.spec.js": "index/level1/level2.spec.js",
      "util1.js": "index/level1/level2/util1.js",
      "util2.js": "index/level1/level2/util2.js",
    },
  ],
  [
    "duplicates",
    {
      "index.js": "index.js",
      "dir1/file.js": "index/file.js",
      "dir2/file.js": "index/dir2-file.js",
      "dir3/sub/file.js": "index/dir3-sub-file.js",
      "dir4/sub/file.js": "index/dir4-sub-file.js",
      "dir5/index.js": "index/dir5.js",
      "dir5/sub1/file.js": "index/dir5/file.js",
      "dir5/sub1/file.spec.js": "index/dir5/file.spec.js",
      "dir5/sub2/file.js": "index/dir5/dir5-sub2-file.js",
      "dir5/sub2/file.spec.js": "index/dir5/dir5-sub2-file.spec.js",
    },
  ],
  [
    "commented-imports",
    {
      "index.js": "index.js",
      "existent.js": "index/existent.js",
    },
  ],
  [
    "shared-with-dependencies",
    {
      "Area.js": "index/shared/Area.js",
      "Area.config.js": "index/shared/Area/Area.config.js",
      "Area.module.scss": "index/shared/Area/Area.module.scss",
      "CheckboxWithLabel.js": "index/shared/CheckboxWithLabel.js",
      "CheckboxWithLabel.scss":
        "index/shared/CheckboxWithLabel/CheckboxWithLabel.scss",
      "ConfigForm.js":
        "index/ParticipantSetup/ParticipantSetupForm/ConfigForm.js",
      "ConfigForm.module.scss":
        "index/ParticipantSetup/ParticipantSetupForm/ConfigForm/ConfigForm.module.scss",
      "ParticipantSetup.js": "index/ParticipantSetup.js",
      "ParticipantSetup.scss": "index/ParticipantSetup/ParticipantSetup.scss",
      "ParticipantSetupForm.js":
        "index/ParticipantSetup/ParticipantSetupForm.js",
      "ParticipantSetupForm.scss":
        "index/ParticipantSetup/ParticipantSetupForm/ParticipantSetupForm.scss",
      "RadioBoxGroup.js":
        "index/ParticipantSetup/ParticipantSetupForm/ConfigForm/RadioBoxGroup.js",
      "RadioBoxGroup.scss":
        "index/ParticipantSetup/ParticipantSetupForm/ConfigForm/RadioBoxGroup/RadioBoxGroup.scss",
      "SomeOtherResource.js": "index/SomeOtherResource.js",
      "SomeOtherResource.module.scss":
        "index/SomeOtherResource/SomeOtherResource.module.scss",
      "index.js": "index.js",
    },
  ],
];

describe(toFractalTree, () => {
  test.each(table)("%s", (folder, resultingTree) => {
    const filePaths = glob.sync(
      path.resolve(__dirname, "fixtures", folder, "./**/*.js")
    );
    const { graph } = buildGraph(filePaths);

    const tree = toFractalTree(graph, findEntryPoints(graph), {
      nestMainModules: false,
    });
    expect(tree).toEqual(resultingTree);
  });
});
