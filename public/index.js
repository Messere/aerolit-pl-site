(function() {

    const inputParser = function(terminal, fileSystem, commands, unknownCommandHandler) {
        this.terminal = terminal;
        this.fileSystem = fileSystem;

        const parse = (input) => {
            const chunks = input.split(/\s+/);
            return {
                command: chunks.shift(),
                options: chunks
            };            
        }

        this.handle = (input) => {
            const commandInfo = parse(input);

            // handle executable files
            const path = this.fileSystem.normalizePath(commandInfo.command);
            if (this.fileSystem.exists(path)) {
                const file = this.fileSystem.getFile(path);
                if (typeof file === 'function') {
                    file();
                    return;
                }
            }

            const command = commands[commandInfo.command] || unknownCommandHandler;
            terminal.printLn('');
            command.execute(commandInfo, this.terminal);
        };
    }     

    const promptHandler = function(promptPrefix, promptSuffix, fileSystem) {
        this.promptPrefix = promptPrefix;
        this.promptSuffix = promptSuffix;
        this.fileSystem = fileSystem;

        this.get = () => {
            return this.promptPrefix + '/' + this.fileSystem.currentDir.join('/') + this.promptSuffix;
        }
    }
    const unknownCommand = function() {
        this.execute = (commandInfo, terminal) => {
            terminal.printLn(commandInfo.command + ': command not found')
        }
    }

    const openUrl = (url) => {
        location.assign(url);
    }

    const fileSystem = {
        currentDir: [],
        dirs: {
            'www': {
                'aerolit.pl': openUrl.bind(this, 'https://aerolit.pl/'),
                'montypython': openUrl.bind(this, 'https://montypython.aerolit.pl/'),
                'niemen': openUrl.bind(this, 'https://niemen.aerolit.pl/forum/'),
                'osjan': openUrl.bind(this, 'https://osjan.aerolit.pl/'),
            },
            'sites': {
                'hosted' : {
                    'pikantnasztuka': openUrl.bind(this, 'https://pikantnasztuka.aerolit.pl/'),
                    'dziwnonoc': openUrl.bind(this, 'https://dziwnonoc.aerolit.pl/')
                },
                'external' : {

                }
            },
            'readme.txt': 'Hello world!',
        },
        getFile: (path) => {
            if (null === path) {
                return null;
            }

            let file = fileSystem.dirs;
            for (const dir of path) {
                file = file[dir] || null;
                if (null === file) {
                    break;
                }
            }
            return file;
        },
        isDir: (path) => {
            return typeof fileSystem.getFile(path) === 'object';
        },
        exists: (path) => {
            return null !== fileSystem.getFile(path);
        },
        normalizePath: (path) => {
            let normalizedPath = [];
            if (path[0] !== '/') {
                normalizedPath = [...fileSystem.currentDir];
            }
            let pathChunks = path.split(/\/+/);
            for (const chunk of pathChunks) {
                switch (chunk) {
                    case '':
                    case '.':
                        continue;
                    case '..':
                        normalizedPath.pop();
                        break;
                    default: 
                        if (fileSystem.exists([...normalizedPath, chunk])) {
                            normalizedPath.push(chunk);
                        } else {
                            return null;
                        }
                        break;
                }
            }
            return normalizedPath;
        },
        rm: (path) => {
            var file = path.pop();
            console.log(path, file);
            delete fileSystem.getFile(path)[file];
        }
    }

    function cmdHelp(commands) {
        this.commands = commands;
        this.help = (terminal) => {
            terminal.printLn('Built in help');
            terminal.printLn('Usage:');
            terminal.printLn(' help           - shows all commands');
            terminal.printLn(' help <command> - shows help for command');
        }
        this.execute = (commandInfo, terminal) => {
            if (commandInfo.options.length > 0) {
                const command = this.commands[commandInfo.options[0]] || null;
                if (command) {
                    command.help(terminal);
                } else {
                    terminal.printLn('Unknown command: ' + command);
                }
            } else {
                terminal.print('Commands: ')
                for (const commandName in commands) {
                    terminal.print(commandName + ' ');
                }
                terminal.printLn('Type help <command name> for details');
            }
        }
    }

    function cmdLs(fileSystem) {
        this.fileSystem = fileSystem;
        this.help = (terminal) =>{
            terminal.printLn('ls - list contents of current directory');
        };
        this.execute = (commandInfo, terminal) => {
            let currentDir = this.fileSystem.dirs;
            for (const dir of this.fileSystem.currentDir) {
                currentDir = currentDir[dir];
            }
            for (const file in currentDir) {
                terminal.print(file + ' ', getFileType(this.fileSystem.normalizePath(file)));
            }
        };
        const getFileType = (path) => {
            if (this.fileSystem.isDir(path)) {
                return 'file-dir';
            }
            const file = this.fileSystem.getFile(path);
            if (typeof file === 'function') {
                return 'file-executable';
            }
        }
    }

    function cmdCd(fileSystem) {
        this.fileSystem = fileSystem;
        this.help = (terminal) =>{
            terminal.printLn('cd <dir> - changes current working directory to <dir>');
            terminal.printLn('cd - changes current directory to /');
        };
        this.execute = (commandInfo, terminal) => {
            if (commandInfo.options.length === 0) {
                this.fileSystem.currentDir = [];
            } else {
                const path = this.fileSystem.normalizePath(commandInfo.options[0]);
                if (null === path) {
                    terminal.printLn('cd: ' + commandInfo.options[0] + ': No such file or directory')
                } else if (this.fileSystem.isDir(path)) {
                    this.fileSystem.currentDir = path;
                } else {
                    terminal.printLn('cd: ' + commandInfo.options[0] + ': Not a directory')
                }
            }            
        }
    }

    function cmdPwd(fileSystem) {
        this.fileSystem = fileSystem;
        this.help = (terminal) =>{
            terminal.printLn('pwd - show current working directory')
        };
        this.execute = (commandInfo, terminal) => {
            terminal.printLn('/' + this.fileSystem.currentDir.join('/'));
        }
    }

    function cmdRm(fileSystem) {
        this.fileSystem = fileSystem;
        this.help = (terminal) =>{
            terminal.printLn('rm <file>   - remove <file>')
            terminal.printLn('rm -r <dir> - remove directory <dir> recursively')
        };
        this.execute = (commandInfo, terminal) => {
            const firstOption = commandInfo.options.shift();
            const force = firstOption === '-r';
            const file = force ? commandInfo.options.shift() : firstOption;

            if (typeof file === 'undefined') {
                terminal.printLn('rm: missing operand');
            } else {
                const path = this.fileSystem.normalizePath(file);
                if (!this.fileSystem.exists(path)) {
                    terminal.printLn('rm: cannot remove \'' + file + '\': No such file or directory');
                } else {
                    if (!this.fileSystem.isDir(path) || force) {
                        this.fileSystem.rm(path);
                    } else {
                        terminal.print('rm: cannot remove \'' + file + '\': Is a directory');
                    }
                }                
            }
        }
    }

    function cmdRmDir(fileSystem) {
        this.fileSystem = fileSystem;
        this.help = (terminal) =>{
            terminal.printLn('rm <dir> - remove empty directory <dir>')
        };
        this.execute = (commandInfo, terminal) => {

        }
    }

    function cmdCat(fileSystem) {
        this.fileSystem = fileSystem;
        this.help = (terminal) => {
            terminal.printLn('cat <file> - show contents of the <file>');
        };
        this.execute = (commandInfo, terminal) => {
            const file = commandInfo.options.shift();
            if (typeof file === 'undefined') {
                terminal.printLn('file: missing operand');
            } else {
                const path = this.fileSystem.normalizePath(file);
                if (!this.fileSystem.exists(path)) {
                    terminal.printLn('cat: ' + file + ': No such file or directory');
                } else {
                    if (this.fileSystem.isDir(path)) {
                        terminal.printLn('cat: ' + file + ': Is a directory');
                    } else {
                        terminal.printLn(this.fileSystem.getFile(path));
                    }
                }
            }
        }
    }

    function cmdFile(fileSystem) {
        this.fileSystem = fileSystem;
        this.help = (terminal) => {
            terminal.printLn('file <path> - show file type')
        };
        this.execute = (commandInfo, terminal) => {
            const file = commandInfo.options.shift();
            if (typeof file === 'undefined') {
                terminal.printLn('file: missing operand');
            } else {
                const path = this.fileSystem.normalizePath(file);
                if (!this.fileSystem.exists(path)) {
                    terminal.printLn(file + ': cannot open `' + file + '\' (No such file or directory)');
                } else {
                    if (this.fileSystem.isDir(path)) {
                        terminal.printLn(file + ': directory');
                    } else {
                        var fileObj = this.fileSystem.getFile(path);
                        if (typeof fileObj === 'function') {
                            terminal.printLn(file + ': ECMAScript executable');
                        } else {
                            terminal.printLn(file + ': text file');
                        }
                    }
                }
            }
        }
    }

    const commands = function() {
        this.help = new cmdHelp(this);
        this.ls = new cmdLs(fileSystem);
        this.cd = new cmdCd(fileSystem);
        this.pwd = new cmdPwd(fileSystem);
        this.rm = new cmdRm(fileSystem);
        this.rmdir = new cmdRmDir(fileSystem);
        this.file = new cmdFile(fileSystem);
        this.cat = new cmdCat(fileSystem);
    }

    const terminal = new Terminal();
    const prompt = new promptHandler("aerolit.pl [", "]$ ", fileSystem);
    const parser = new inputParser(
        terminal,
        fileSystem,
        new commands(), 
        new unknownCommand()
    );

    const handleCommand = (input) => {
        if (typeof input !== 'undefined' && input.trim() !== '') {
            parser.handle(input);
        }
        terminal.printLn('');
        terminal.input(prompt.get(), handleCommand);
    }

    document.getElementById('main').appendChild(terminal.html);

    handleCommand();
})();
