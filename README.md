# destiny

Prettier for File Structures

[![npm version](https://badge.fury.io/js/destiny.svg)](https://badge.fury.io/js/destiny)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/benawad/destiny/issues)

---

Motivation: https://www.youtube.com/watch?v=rGYbrIf-y58

![example transformation](https://github.com/benawad/destiny/blob/master/assets/example.png)

## What does this do?

1. Scans a folder for all the files in it
2. Creates a directed graph based on how the JavaScript/TypeScript files import each other
   ![example directed graph](https://github.com/benawad/destiny/blob/master/assets/graph.png)
3. Creates a fractal representation of the graph (following similar rules outlined here: https://hackernoon.com/fractal-a-react-app-structure-for-infinite-scale-4dab943092af)
4. Moves existing files into the fractal structure
5. Fixes imports
6. Removes all empty folders
7. Prints files that are "unused" (not imported by anyone and doesn't import anything)

The end result is a "prettified" file structure.

## Disclaimer

- This is a work in progress and 100% has bugs of some kind in it
- BEFORE running this tool on your codebase, make sure you have commited to git or made a backup (I don't expect the tool to destroy your work (although it's possible), but just in case you don't like the results)
- Snapshot tests don't format correctly
- Only works on JavaScript/TypeScript codebases (althought this concept could probably be extended to any language)

## How to run it

```
npx destiny src/**/*.*
```

## This tool might be useless

It might be better to just name your folders.

## Contributing

pull requests are welcome :)
