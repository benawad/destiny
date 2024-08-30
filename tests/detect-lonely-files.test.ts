import * as path from "path";
import * as glob from "glob";

import { detectLonelyFiles } from "../src/index/shared/detect-lonely-files";
import { buildGraph } from "../src/index/generateTrees/buildGraph";
import { toFractalTree } from "../src/index/generateTrees/toFractalTree";
import { findEntryPoints } from "../src/index/generateTrees/findEntryPoints";

const mockedTest = (
  name: string,
  tree: Record<string, string>,
  result: Record<string, string>
) => {
  it(name, () => {
    expect(detectLonelyFiles(tree)).toEqual(result);
  });
};

const t = (folder: string, g2: any, entryPoints?: string[]) => {
  it(folder, () => {
    const g1 = buildGraph(
      glob.sync(path.join(__dirname, "fixtures", folder, "/**/*.js"))
    ).graph;
    expect(
      detectLonelyFiles(toFractalTree(g1, entryPoints || findEntryPoints(g1)))
    ).toEqual(g2);
  });
};

describe("detectLonelyFiles", () => {
  mockedTest(
    "should move when lonely file",
    {
      "file.js": "file.js",
      "page/page.js": "file/page.js",
    },
    {
      "file.js": "file.js",
      "page/page.js": "page.js",
    }
  );

  mockedTest(
    "should not move file when sibling file is present after moving",
    {
      "file.js": "file.js",
      "page/page.js": "file/page.js",
      "header/header.js": "file/page/header.js",
    },
    {
      "file.js": "file.js",
      "page/page.js": "file/page.js",
      "header/header.js": "file/header.js",
    }
  );

  t("simple", {
    "index.js": "index.js",
    "routes.js": "index/routes.js",
    "home.js": "index/home.js",
  });

  t("index-cycle", {
    "index.js": "index.js",
    "routes/index.js": "index/routes.js",
    "home/index.js": "index/home.js",
    "login/index.js": "index/login.js",
    "utils/search.js": "index/search.js",
  });

  t("sharing", {
    "index.js": "index.js",
    "footer/index.js": "index/footer.js",
    "header/helper.js": "index/helper.js",
    "header/index.js": "index/header.js",
  });

  t("spec-files", {
    "index.js": "index.js",
    "index.spec.js": "index.spec.js",
    "level1.js": "index/level1.js",
    "level1.spec.js": "index/level1.spec.js",
    "level2.js": "index/level1/level2.js",
    "level2.spec.js": "index/level1/level2.spec.js",
    "util1.js": "index/level1/level2/util1.js",
    "util2.js": "index/level1/level2/util2.js",
  });

  t("duplicates", {
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
  });

  t("commented-imports", {
    "index.js": "index.js",
    "existent.js": "existent.js",
  });

  t("single-file-folder", {
    "file.js": "file.js",
    "page/page.js": "page.js",
  });

  t("shared-with-dependencies", {
    "Area.js": "index/shared/Area.js",
    "Area.module.scss": "index/shared/Area/Area.module.scss",
    "Area.config.js": "index/shared/Area/Area.config.js",
    "CheckboxWithLabel.js": "index/shared/CheckboxWithLabel.js",
    "CheckboxWithLabel.scss": "index/shared/CheckboxWithLabel.scss",
    "ConfigForm.js":
      "index/ParticipantSetup/ParticipantSetupForm/ConfigForm.js",
    "ConfigForm.module.scss":
      "index/ParticipantSetup/ParticipantSetupForm/ConfigForm/ConfigForm.module.scss",
    "ParticipantSetup.js": "index/ParticipantSetup.js",
    "ParticipantSetup.scss": "index/ParticipantSetup/ParticipantSetup.scss",
    "ParticipantSetupForm.js": "index/ParticipantSetup/ParticipantSetupForm.js",
    "ParticipantSetupForm.scss":
      "index/ParticipantSetup/ParticipantSetupForm/ParticipantSetupForm.scss",
    "RadioBoxGroup.js":
      "index/ParticipantSetup/ParticipantSetupForm/ConfigForm/RadioBoxGroup.js",
    "RadioBoxGroup.scss":
      "index/ParticipantSetup/ParticipantSetupForm/ConfigForm/RadioBoxGroup.scss",
    "SomeOtherResource.js": "index/SomeOtherResource.js",
    "SomeOtherResource.module.scss": "index/SomeOtherResource.module.scss",
    "index.js": "index.js",
  });
});
