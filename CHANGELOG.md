## [0.7.1](https://github.com/benawad/destiny/compare/v0.7.0...v0.7.1) (2020-08-19)


### Bug Fixes

* [#115](https://github.com/benawad/destiny/issues/115), fix [#107](https://github.com/benawad/destiny/issues/107) ([8a4ea3e](https://github.com/benawad/destiny/commit/8a4ea3e36c5e2ca38691f99b808ae0a4be32c670))
* [#136](https://github.com/benawad/destiny/issues/136) ([b194bbf](https://github.com/benawad/destiny/commit/b194bbfc440e5b1d4c010927219c08b1031b94f3))
* [#138](https://github.com/benawad/destiny/issues/138) ([54bd159](https://github.com/benawad/destiny/commit/54bd1598de9182896a3d8e9decd8647ec0ae68de))
* add utils to spec fixture ([9d75c93](https://github.com/benawad/destiny/commit/9d75c937cf383e1e8136e9af14f188a373a49bc3))
* don't overwrite existing files ([9a2c6c4](https://github.com/benawad/destiny/commit/9a2c6c4bed1798eaa57c90383bb803bc9f7fb9d5))
* handle edge cases where linked file is not found ([3a139cd](https://github.com/benawad/destiny/commit/3a139cd1931649cf86b4b3fc20e345ce42b65737))
* look for source file based on test file name first instead of first import ([0544d61](https://github.com/benawad/destiny/commit/0544d61c4e09014f23e910a3539eae8b2aca9963))
* remove node_module test because git ignores that folder ([6036bab](https://github.com/benawad/destiny/commit/6036bab049f51b63b1cccbf53dd8ded1730af0d5))
* treat story files like tests ([16edcb7](https://github.com/benawad/destiny/commit/16edcb7f03c63517f7c4ee8c160e7079771aee4a))
* unused files ([85543f4](https://github.com/benawad/destiny/commit/85543f432ee552d5941ca29c6900c3ba849612df))

# [0.7.0](https://github.com/benawad/destiny/compare/v0.6.2...v0.7.0) (2020-05-23)


### Bug Fixes

* [#128](https://github.com/benawad/destiny/issues/128) ([3c33290](https://github.com/benawad/destiny/commit/3c33290352ccb450051ea5359b33e1ac9868466d))
* [#135](https://github.com/benawad/destiny/issues/135) ([8a2a1c0](https://github.com/benawad/destiny/commit/8a2a1c06301b53f457d738d255b65f30dd3d41cb))


### Features

* **debugger:** log full data ([09a78f4](https://github.com/benawad/destiny/commit/09a78f4289abef805dd5b6f4b680a12990ed1391))

## [0.6.2](https://github.com/benawad/destiny/compare/v0.6.1...v0.6.2) (2020-04-29)


### Bug Fixes

* [#111](https://github.com/benawad/destiny/issues/111) ([3b05b2a](https://github.com/benawad/destiny/commit/3b05b2a6b371bd53276bc316393dfd6883c001aa))
* [#119](https://github.com/benawad/destiny/issues/119) ([366f8cf](https://github.com/benawad/destiny/commit/366f8cfdb200fdaffc820b4fb6b61893aed0fdc7))
* [#129](https://github.com/benawad/destiny/issues/129) ([2db66af](https://github.com/benawad/destiny/commit/2db66af44bf746e11251d1b6b7fff1830368ae97))
* **#125:** resolve home dir ([40b36a2](https://github.com/benawad/destiny/commit/40b36a22c0dbb86bf7217bae984ec0ffa4556c2e))
* check cycle when graphl is all globals ([7880933](https://github.com/benawad/destiny/commit/78809330a3be0c04484483a91e2dd5642c8915e9))

## [0.6.1](https://github.com/benawad/destiny/compare/v0.6.0...v0.6.1) (2020-04-25)


### Reverts

* Revert "chore(release): 0.6.0 [skip ci]" ([9d2dbc1](https://github.com/benawad/destiny/commit/9d2dbc1af47e6189ec7e261f1a1140685e1770e5))

# [0.5.0](https://github.com/benawad/destiny/compare/v0.4.0...v0.5.0) (2020-03-26)

### Bug Fixes

- Glob stays in the tree's root path - [#88](https://github.com/benawad/destiny/issues/88) ([3795d40](https://github.com/benawad/destiny/commit/3795d40b9b20e04215eb57fa8bb919a8ad774195))

### Features

- **debugger:** add debugger ([10d6a8b](https://github.com/benawad/destiny/commit/10d6a8b095b74f0e34419941d64468e8ffa1bd74))

# [0.4.0](https://github.com/benawad/destiny/compare/v0.3.1...v0.4.0) (2020-03-04)

### Bug Fixes

- ensure path correctness ([f22f07f](https://github.com/benawad/destiny/commit/f22f07f962c130a821009b43c0e568d819533b96)), closes [#81](https://github.com/benawad/destiny/issues/81)
- extend linting ([039cadf](https://github.com/benawad/destiny/commit/039cadf98fb5e08fcf469faa95154b763b64c3bd))
- fix new linting issues ([c19f2e5](https://github.com/benawad/destiny/commit/c19f2e53a93c3859c7c02fd206c87c2b367efe36))
- Fix time complexity when searching for common parent dir ([ce9915e](https://github.com/benawad/destiny/commit/ce9915eac72870135e30b9b895a4ad265a004266))
- improve regex path matching ([ff9b19b](https://github.com/benawad/destiny/commit/ff9b19b43870a6fd0d43364ce9e342c4f2c6b30c)), closes [#87](https://github.com/benawad/destiny/issues/87)
- support paths in config via include ([c049ceb](https://github.com/benawad/destiny/commit/c049cebf336da6a01f3b931a2ce0b62d0f482b06))

### Features

- Add CLI flag to rename single files ([2de9ff1](https://github.com/benawad/destiny/commit/2de9ff1acde8c040fe324b8d9a5fc37b6413e935))

## [0.3.1](https://github.com/benawad/destiny/compare/v0.3.0...v0.3.1) (2020-02-26)

### Bug Fixes

- don't fail if can't find file and add json support ([954e9db](https://github.com/benawad/destiny/commit/954e9dbacb7515bd1e358723086e8aeff6d7ca7b))
- ensure unique edges ([a50c40c](https://github.com/benawad/destiny/commit/a50c40c6d333343bfd102d6f2cafce344fbc13aa))

# [0.3.0](https://github.com/benawad/destiny/compare/v0.2.1...v0.3.0) (2020-02-24)

### Bug Fixes

- **printTree:** colorize tree ([9fd4706](https://github.com/benawad/destiny/commit/9fd4706deec7ef40238eaf0113e198f562584453))
- add generateTrees module ([e0366d6](https://github.com/benawad/destiny/commit/e0366d662d7051d9cdbe0e44fe98b1743c739a13))
- create restructure map ([4090fdd](https://github.com/benawad/destiny/commit/4090fdd90191c87f834bfc7f14651c1d5e5b09c4))
- use generateTrees and refactor formatFileStructure ([fb48957](https://github.com/benawad/destiny/commit/fb489571a67cd466cdcedd03787238eda9345b04))
- **printTree:** add leaf resolver ([514084a](https://github.com/benawad/destiny/commit/514084a5ffbd27badc2fd75716edc9aac974c988))
- **printTree:** add proper sorting of files and directories ([bc177c1](https://github.com/benawad/destiny/commit/bc177c10b7155634a15c990264ee505a82067d8c))
- **printTree:** position our leafs ([1b5bca1](https://github.com/benawad/destiny/commit/1b5bca10b3d29853feeb70f67e096f9b4a74ec3e))

### Features

- **cli:** only restructure with write option ([65313bb](https://github.com/benawad/destiny/commit/65313bb35c042d0a9e89d832fbe74c67da5a6988))
- **printTree:** print tree ([ef01dae](https://github.com/benawad/destiny/commit/ef01dae807e7ca12ec535e2796bf69782df1e68f))
- add support for sass ([f70e96b](https://github.com/benawad/destiny/commit/f70e96bc064988c325d655a9e1c98c37fc06ae2f))
- remove detect-roots option ([7812dc6](https://github.com/benawad/destiny/commit/7812dc6310a6afbd0fcfb0cd7966b95ceee30dca))

## [0.2.1](https://github.com/benawad/destiny/compare/v0.2.0...v0.2.1) (2020-02-20)

### Bug Fixes

- add semantic release config ([9b1c635](https://github.com/benawad/destiny/commit/9b1c6350cfdb5692437f687da1f1e639e44fca3a))
