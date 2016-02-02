var gulp = require('gulp');
var _ = require('lodash');
var fs = require('fs');
var inquirer = require('inquirer');

var config = {
    stylesDir: 'assets/sass/',
    rootFile: 'styles.scss'
};

function getFileData(type, name, requires) {
    var fileStr = '@import "../global.scss";\n' +
        '{{requires}}\n' +
        '@include exports("{{moduleName}}") {\n\n' +
        '    {{content}}\n' +
        '}\n';

    var content = '';
    var moduleName = name;
    var folder = type;

    switch (type) {
        case 'data':
            moduleName = 'data-' + name;
            content = '$data-name: "' + moduleName + '";\n\n    [#{$data-name}] {\n\n    }';
            break;
        case 'module':
            moduleName = name = _.startCase(name).replace(' ', '');
            folder += 's';
            content = '.' + moduleName + ' {\n\n    }';
            break;
        case 'page':
            name = _.camelCase(name);
            moduleName = 'Page--' + name;
            folder += 's';
            content = '.' + moduleName + ' {\n\n    }';
            break;
    }

    _.forEach(requires, function(require) {
        if (!require) return;
        fileStr = fileStr.replace('{{requires}}', '@import "'+require+'";\n{{requires}}');
    });
    fileStr = fileStr.replace('{{requires}}', '')
        .replace('{{moduleName}}', moduleName)
        .replace('{{content}}', content);

    return {
        folder: folder,
        name: name,
        contents: fileStr
    };
}

function writeNewFile(data) {

    var folder = data.folder;
    var name = data.name;
    var fileStr = data.contents;

    fs.writeFile(config.stylesDir + folder + '/_' + name + '.scss', fileStr);

    var rootFile = fs.readFileSync(config.stylesDir + config.rootFile).toString().split("\n");
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
                fs.writeFile(config.stylesDir + config.rootFile, outFile.join("\n"));
                return false;
            }
        }
        else if (inGroup) {
            outFile.splice(i, 0, '@import "' + folder + '/' + name + '";');
            fs.writeFile(config.stylesDir + config.rootFile, outFile.join("\n"));
            return false;
        }
    });
}

gulp.task('generate:style', function() {

    inquirer.prompt([{
        name: 'type',
        type: 'list',
        message: 'Choose a type:',
        choices: ['common', 'data', 'module', 'page']
    }, {
        name: 'name',
        type: 'input',
        message: 'Choose a name:'
    }, {
        name: 'requires',
        type: 'input',
        message: 'Provide dependencies, if any (space separated):'
    }], function(answers) {
        var data = getFileData(answers.type, _.kebabCase(answers.name), answers.requires.split(' '));

        fs.stat(config.stylesDir + data.folder + '/_' + data.name + '.scss', function(err, stat) {
            if (!err) {
                inquirer.prompt({
                    type: 'confirm',
                    name: 'overwriteFile',
                    message: 'This file already exists, continuing will overwrite the file. Do you wish to continue',
                    default: false
                }, function(answer) {
                    if (answer.overwriteFile) {
                        writeNewFile(data);
                    }
                });
            }
            else {
                writeNewFile(data);
            }
        });
    });
});
