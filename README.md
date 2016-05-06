# gulp_tasks
A folder of gulp tasks with a goal of finding a happy medium between abstraction and simplicity

## Installation

1. Move the `package.json` file into the parent directory.
  - The file contains a few common front-end libs in the `dependencies`. Feel free to strip out any unnecessary libraries. All of the `devDependencies` are used in the gulp tasks, so it is not recommended that you remove any of those packages.
3. Run `npm install`.
4. Create a file named `gulpfile.js` in the parent directory with the following code included: 

```javascript
var gulp = require('gulp');
var tasks = require('./gulp_tasks/manifest');

///* optionally override default settings */
// var _ = require('lodash');
// _.assign(tasks.config, {
//     name: 'Purpose Generation',
//     domain: 'dev.purposegeneration.com'
// });

require('./gulp_tasks/browser-sync');
require('./gulp_tasks/icons');
require('./gulp_tasks/images');
require('./gulp_tasks/scripts');
require('./gulp_tasks/styles');

gulp.task('default', tasks.default);
gulp.task('lint', tasks.lint);
gulp.task('watch', tasks.watch);
```

You will now be able to run `gulp` or `gulp default` to build the project's assets. `gulp watch` will build the assest and then watch the necesary directories to recompile when changed.

## Config

### name

_String,_ default: **'Project Name'**<br>
A colloquial name for the project. Used for system notifications when a file is changed/recompiled.

### icon

_String,_ default: **'public/favicon-96x96.png'**<br>
A path* to an image to display beside the `name` when a notification occurs.

### domain

_String,_ default: **'dev.example.com'**<br>
A web address that browser sync should proxy.

### resourceDir

_String,_ default: **'assets/'**<br>
A path* to the source assets.


### publicDir

_String,_ default: **'public/'**<br>
A destination path* for compiled assets.

*Note: All paths are relative to the project's root directory.
