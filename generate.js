var gulp = require('gulp');
var args = require('yargs').argv;
var _ = require('lodash');
var fs = require('fs');

var config = {
    stylesDir: 'assets/sass/'
};

gulp.task('generate:style', function() {
    var fileStr = '@import "../global.scss";\n' +
        '{{requires}}\n' +
        '@include exports("{{moduleName}}") {\n\n' +
        '    {{content}}\n' +
        '}\n';
    var requires = args.requires;
    var content = '';
    var name = _.kebabCase(args.name);
    var moduleName = name;
    var folder = args.type;
    if (args.type === 'data') {
        moduleName = 'data-' + name;
        content = '$data-name: "' + moduleName + '";\n\n    [#{$data-name}] {\n\n    }';
    }
    else if (args.type === 'module') {
        moduleName = name = _.startCase(name).replace(' ', '');
        folder += 's';
        content = '.' + moduleName + ' {\n\n    }';
    }
    else if (args.type === 'page') {
        name = _.camelCase(name);
        moduleName = 'Page--' + name;
        folder += 's';
        content = '.' + moduleName + ' {\n\n    }';
    }

    if (!requires) {
        requires = [];
    }
    else if (!_.isArray(requires)) {
        requires = [requires];
    }

    _.forEach(requires, function(require) {
        fileStr = fileStr.replace('{{requires}}', '@import "'+require+'";\n{{requires}}');
    });
    fileStr = fileStr.replace('{{requires}}', '')
        .replace('{{moduleName}}', moduleName)
        .replace('{{content}}', content);

    fs.writeFile(config.stylesDir + folder + '/_' + name + '.scss', fileStr);

    var rootFile = fs.readFileSync(config.stylesDir + 'styles.scss').toString().split("\n");
    var outFile = rootFile.slice();
    var inGroup = false;
    _.forEach(rootFile, function(line, i) {
        if (_.startsWith(line, '@import "' + folder)) {
            inGroup = true;
            var lineName = line.replace('@import "' + folder + '/', '').replace('";', '');
            if (lineName === name) {
                return false;
            }
            if (lineName > name) {
                outFile.splice(i, 0, '@import "' + folder + '/' + name + '";');
                fs.writeFile(config.stylesDir + 'styles.scss', outFile.join("\n"));
                return false;
            }
        }
        else if (inGroup) {
            outFile.splice(i, 0, '@import "' + folder + '/' + name + '";');
            fs.writeFile(config.stylesDir + 'styles.scss', outFile.join("\n"));
            return false;
        }
    });
});