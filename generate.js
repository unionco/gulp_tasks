var gulp = require('gulp');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');

var config = {
    stylesDir: 'assets/sass/',
    rootFile: 'styles.scss'
};

function getFileData(folder, name, requires) {

    switch (folder) {
        case 'modules':
            name = _.camelCase(name).replace(/^(.)/, c => c.toUpperCase());
            break;
        case 'pages':
            name = _.camelCase(name);
            break;
    }

    var contents = fs.readFileSync(config.stylesDir + '_templates/_' + folder + '.scss').toString();

    requires = requires.filter(r => !!r)
        .map(req => '@import "' + req + '";');

    contents = contents.replace("#{'requires'}", requires.join("\n"))
        .replace(/#{'name'}/g, name);

    return {
        folder: folder,
        name: name,
        contents: contents
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

function getFiles(srcpath) {
    return fs.readdirSync(srcpath)
        .filter(function(file) {
            return fs.statSync(path.join(srcpath, file)).isFile();
        })
        .map(function(file) {
            return file.replace(/^_/, '').replace(/\.scss$/, '');
        });
}

gulp.task('generate:style', function() {

    inquirer.prompt([{
        name: 'type',
        type: 'list',
        message: 'Choose a type:',
        choices: getFiles(config.stylesDir + '_templates')
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
