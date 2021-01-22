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
      "routes.js": "routes/routes.js",
      "home.js": "routes/home.js",
    },
  ],
  [
    "index-cycle",
    {
      "index.js": "index.js",
      "routes/index.js": "routes/routes.js",
      "login/index.js": "login/login.js",
      "home/index.js": "routes/home.js",
      "utils/search.js": "login/search/search.js",
    },
  ],
  [
    "sharing",
    {
      "index.js": "index.js",
      "footer/index.js": "footer/footer.js",
      "header/index.js": "header/header.js",
      "header/helper.js": "shared/helper.js",
    },
  ],
  [
    "spec-files",
    {
      "index.js": "index.js",
      "index.spec.js": "index.spec.js",
      "level1.js": "level1/level1.js",
      "level1.spec.js": "level1/level1.spec.js",
      "level2.js": "level1/level2/level2.js",
      "level2.spec.js": "level1/level2/level2.spec.js",
      "util1.js": "level1/level2/util1.js",
      "util2.js": "level1/level2/util2.js",
    },
  ],
  [
    "duplicates",
    {
      "index.js": "index.js",
      "dir1/file.js": "file.js",
      "dir2/file.js": "dir2-file.js",
      "dir3/sub/file.js": "dir3-sub-file.js",
      "dir4/sub/file.js": "dir4-sub-file.js",
      "dir5/index.js": "dir5/dir5.js",
      "dir5/sub1/file.js": "dir5/file.js",
      "dir5/sub1/file.spec.js": "dir5/file.spec.js",
      "dir5/sub2/file.js": "dir5/dir5-sub2-file.js",
      "dir5/sub2/file.spec.js": "dir5/dir5-sub2-file.spec.js",
    },
  ],
  [
    "commented-imports",
    {
      "index.js": "index.js",
      "existent.js": "existent.js",
    },
  ],
  [
    "shared-with-dependencies",
    {
      "Area.config.js": "shared/Area/Area.config.js",
      "Area.js": "shared/Area.js",
      "Area.module.scss": "shared/Area/Area.module.scss",
      "CheckboxWithLabel.js": "shared/CheckboxWithLabel.js",
      "CheckboxWithLabel.scss":
        "shared/CheckboxWithLabel/CheckboxWithLabel.scss",
      "ConfigForm.js":
        "ParticipantSetup/ParticipantSetupForm/ConfigForm/ConfigForm.js",
      "ConfigForm.module.scss":
        "ParticipantSetup/ParticipantSetupForm/ConfigForm/ConfigForm.module.scss",
      "ParticipantSetup.js": "ParticipantSetup/ParticipantSetup.js",
      "ParticipantSetup.scss": "ParticipantSetup/ParticipantSetup.scss",
      "ParticipantSetupForm.js":
        "ParticipantSetup/ParticipantSetupForm/ParticipantSetupForm.js",
      "ParticipantSetupForm.scss":
        "ParticipantSetup/ParticipantSetupForm/ParticipantSetupForm.scss",
      "RadioBoxGroup.js":
        "ParticipantSetup/ParticipantSetupForm/ConfigForm/RadioBoxGroup/RadioBoxGroup.js",
      "RadioBoxGroup.scss":
        "ParticipantSetup/ParticipantSetupForm/ConfigForm/RadioBoxGroup/RadioBoxGroup.scss",
      "SomeOtherResource.js": "SomeOtherResource/SomeOtherResource.js",
      "SomeOtherResource.module.scss":
        "SomeOtherResource/SomeOtherResource.module.scss",
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
      nestMainModules: true,
    });
    expect(tree).toEqual(resultingTree);
  });
});
