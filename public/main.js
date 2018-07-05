System.register("Terminal/ICommandHandler", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Terminal/ITerminal", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Prompt/IPrompt", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Command/ITerminalCommand", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Command/ICommandLineParser", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Terminal/Terminal", [], function (exports_6, context_6) {
    "use strict";
    var Terminal;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            Terminal = (function () {
                function Terminal() {
                    this.firstPrompt = true;
                    this.makeNewLine = function (message, className) {
                        var newLine = document.createElement('div');
                        if (className) {
                            newLine.className = className;
                        }
                        newLine.textContent = message;
                        return newLine;
                    };
                    this.setTextSize = function (size) {
                        this.output.style.fontSize = size;
                        this.inputElement.style.fontSize = size;
                    };
                    this.setTextColor = function (col) {
                        this.html.style.color = col;
                        this.cursor.style.background = col;
                    };
                    this.setBackgroundColor = function (col) {
                        this.html.style.background = col;
                    };
                    this.setWidth = function (width) {
                        this.html.style.width = width;
                    };
                    this.setHeight = function (height) {
                        this.html.style.height = height;
                    };
                    this.html = document.createElement('div');
                    this.html.className = 'Terminal';
                    this.innerWindow = document.createElement('div');
                    this.output = document.createElement('p');
                    this.inputLine = document.createElement('span');
                    this.cursor = document.createElement('span');
                    this.inputElement = document.createElement('p');
                    this.inputElement.appendChild(this.inputLine);
                    this.inputElement.appendChild(this.cursor);
                    this.innerWindow.appendChild(this.output);
                    this.innerWindow.appendChild(this.inputElement);
                    this.html.appendChild(this.innerWindow);
                    this.setBackgroundColor('black');
                    this.setTextColor('white');
                    this.setTextSize('1em');
                    this.setWidth('100%');
                    this.setHeight('100%');
                    this.html.style.fontFamily = 'Monaco, Courier';
                    this.html.style.margin = '0';
                    this.innerWindow.style.padding = '10px';
                    this.inputElement.style.margin = '0';
                    this.output.style.margin = '0';
                    this.output.style.display = 'inline';
                    this.cursor.style.background = 'white';
                    this.cursor.innerHTML = 'C';
                    this.cursor.style.display = 'none';
                    this.inputElement.style.display = 'none';
                }
                Terminal.prototype.print = function (message, className) {
                    var newLine = this.makeNewLine(message, className);
                    newLine.style.display = 'inline';
                    this.output.appendChild(newLine);
                };
                Terminal.prototype.printLn = function (message, className) {
                    var newLine = this.makeNewLine(message, className);
                    this.output.appendChild(newLine);
                };
                Terminal.prototype.fireCursorInterval = function (inputField) {
                    var _this = this;
                    setTimeout(function () {
                        if (inputField.parentElement) {
                            _this.cursor.style.visibility =
                                _this.cursor.style.visibility === 'visible'
                                    ? 'hidden'
                                    : 'visible';
                            _this.fireCursorInterval(inputField);
                        }
                    }, 500);
                };
                Terminal.prototype.input = function (message, callback) {
                    var _this = this;
                    var inputField = document.createElement('input');
                    inputField.style.position = 'absolute';
                    inputField.style.zIndex = '-100';
                    inputField.style.outline = 'none';
                    inputField.style.border = 'none';
                    inputField.style.opacity = '0';
                    inputField.style.fontSize = '0.2em';
                    this.inputLine.textContent = '';
                    this.inputElement.style.display = 'inline-block';
                    this.html.appendChild(inputField);
                    this.fireCursorInterval(inputField);
                    if (message.length) {
                        this.print(message, 'prompt');
                    }
                    inputField.onblur = function () {
                        _this.cursor.style.display = 'none';
                    };
                    inputField.onfocus = function () {
                        inputField.value = _this.inputLine.textContent;
                        _this.cursor.style.display = 'inline';
                    };
                    this.html.onclick = function () {
                        inputField.focus();
                    };
                    inputField.onkeydown = function (e) {
                        if (e.which === 37 || e.which === 39 || e.which === 38 || e.which === 40 || e.which === 9) {
                            e.preventDefault();
                        }
                        else if (e.which !== 13) {
                            setTimeout(function () {
                                _this.inputLine.textContent = inputField.value;
                            }, 1);
                        }
                    };
                    inputField.onkeyup = function (e) {
                        if (e.which === 13) {
                            _this.inputElement.style.display = 'none';
                            var inputValue = inputField.value;
                            _this.print(inputValue);
                            _this.html.removeChild(inputField);
                            if (typeof (callback) === 'function') {
                                callback(inputValue);
                            }
                        }
                    };
                    if (this.firstPrompt) {
                        this.firstPrompt = false;
                        setTimeout(function () {
                            inputField.focus();
                        }, 50);
                    }
                    else {
                        inputField.focus();
                    }
                };
                Terminal.prototype.clear = function () {
                    this.output.innerHTML = '';
                };
                return Terminal;
            }());
            exports_6("default", Terminal);
        }
    };
});
System.register("Terminal/SimpleTerminal", [], function (exports_7, context_7) {
    "use strict";
    var SimpleTerminal;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
            SimpleTerminal = (function () {
                function SimpleTerminal(prompt, commandLineParser, terminal) {
                    this.errorCount = 0;
                    this.maxErrorCount = 100;
                    this.prompt = prompt;
                    this.terminal = terminal;
                    this.commandLineParser = commandLineParser;
                }
                SimpleTerminal.prototype.print = function (text, className) {
                    this.terminal.print(text, className);
                };
                SimpleTerminal.prototype.printLn = function (text, className) {
                    this.terminal.printLn(text, className);
                };
                SimpleTerminal.prototype.input = function (commandHandler) {
                    this.terminal.input(this.prompt.getPrompt(), commandHandler);
                };
                SimpleTerminal.prototype.renderTo = function (node) {
                    node.appendChild(this.terminal.html);
                };
                SimpleTerminal.prototype.handleCommandLine = function (input) {
                    try {
                        if (input !== null && input.trim() !== '') {
                            var executableCommand = this.commandLineParser.handle(input);
                            executableCommand(this);
                        }
                        this.printLn('');
                        this.input(this.handleCommandLine.bind(this));
                    }
                    catch (e) {
                        this.printLn('');
                        this.printLn(e.message, 'error');
                        console.debug(e);
                        this.errorCount++;
                        if (this.errorCount < this.maxErrorCount) {
                            this.handleCommandLine(null);
                        }
                        else {
                            console.debug('Too many errors, aborting');
                        }
                    }
                };
                SimpleTerminal.prototype.start = function () {
                    this.handleCommandLine(null);
                };
                return SimpleTerminal;
            }());
            exports_7("default", SimpleTerminal);
        }
    };
});
System.register("File/IFileNode", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("FileSystem/IFileSystem", [], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Prompt/PromptWithCwd", [], function (exports_10, context_10) {
    "use strict";
    var PromptWithCwd;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [],
        execute: function () {
            PromptWithCwd = (function () {
                function PromptWithCwd(fileSystem, prefix, suffix) {
                    this.prefix = prefix;
                    this.suffix = suffix;
                    this.fileSystem = fileSystem;
                }
                PromptWithCwd.prototype.getPrompt = function () {
                    return this.prefix + this.fileSystem.getCwd() + this.suffix;
                };
                return PromptWithCwd;
            }());
            exports_10("default", PromptWithCwd);
        }
    };
});
System.register("File/IFileNodeCollection", [], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("File/DirNode", [], function (exports_12, context_12) {
    "use strict";
    var DirNode;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [],
        execute: function () {
            DirNode = (function () {
                function DirNode(name, children) {
                    this.isDir = true;
                    this.isFile = false;
                    this.isExecutable = false;
                    this.name = name;
                    this.children = children;
                }
                DirNode.prototype.execute = function () {
                    throw new Error('Not executable');
                };
                DirNode.prototype.getContents = function () {
                    return this.children;
                };
                return DirNode;
            }());
            exports_12("default", DirNode);
        }
    };
});
System.register("File/IVoidCallbackFunction", [], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("File/ExecutableFileNode", [], function (exports_14, context_14) {
    "use strict";
    var ExecutableFileNode;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [],
        execute: function () {
            ExecutableFileNode = (function () {
                function ExecutableFileNode(name, callback) {
                    this.isDir = false;
                    this.isFile = true;
                    this.isExecutable = true;
                    this.name = name;
                    this.callback = callback;
                }
                ExecutableFileNode.prototype.execute = function () {
                    this.callback();
                };
                ExecutableFileNode.prototype.getContents = function () {
                    return this.callback;
                };
                return ExecutableFileNode;
            }());
            exports_14("default", ExecutableFileNode);
        }
    };
});
System.register("File/TextFileNode", [], function (exports_15, context_15) {
    "use strict";
    var TextFileNode;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [],
        execute: function () {
            TextFileNode = (function () {
                function TextFileNode(name, contents) {
                    this.isDir = false;
                    this.isFile = true;
                    this.isExecutable = false;
                    this.name = name;
                    this.contents = contents;
                }
                TextFileNode.prototype.execute = function () {
                    throw new Error('Not executable');
                };
                TextFileNode.prototype.getContents = function () {
                    return this.contents;
                };
                return TextFileNode;
            }());
            exports_15("default", TextFileNode);
        }
    };
});
System.register("FileSystem/InMemoryFileSystem", ["File/DirNode", "File/ExecutableFileNode", "File/TextFileNode"], function (exports_16, context_16) {
    "use strict";
    var DirNode_1, ExecutableFileNode_1, TextFileNode_1, InMemoryFileSystem;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (DirNode_1_1) {
                DirNode_1 = DirNode_1_1;
            },
            function (ExecutableFileNode_1_1) {
                ExecutableFileNode_1 = ExecutableFileNode_1_1;
            },
            function (TextFileNode_1_1) {
                TextFileNode_1 = TextFileNode_1_1;
            }
        ],
        execute: function () {
            InMemoryFileSystem = (function () {
                function InMemoryFileSystem(initalDirectoryStructure) {
                    if (initalDirectoryStructure === void 0) { initalDirectoryStructure = {}; }
                    this.directorySeparator = '/';
                    this.directories = initalDirectoryStructure;
                    this.currentWorkingDirectory = [];
                }
                InMemoryFileSystem.prototype.getCwd = function () {
                    return this.directorySeparator
                        + this.currentWorkingDirectory.join(this.directorySeparator);
                };
                InMemoryFileSystem.prototype.setCwd = function (path) {
                    var canonicalPath = this.getCanonicalPath(path);
                    if (this.canonicalPathExists(canonicalPath)) {
                        var file = this.getFileByCanonicalPath(canonicalPath);
                        if (file.isDir) {
                            this.currentWorkingDirectory = canonicalPath;
                        }
                        else {
                            throw Error(path + " is not a directory");
                        }
                    }
                    else {
                        throw Error(path + " does not exist");
                    }
                };
                InMemoryFileSystem.prototype.exists = function (path) {
                    var canonicalPath = this.getCanonicalPath(path);
                    return this.canonicalPathExists(canonicalPath);
                };
                InMemoryFileSystem.prototype.getFile = function (path) {
                    var canonicalPath = this.getCanonicalPath(path);
                    return this.getFileByCanonicalPath(canonicalPath);
                };
                InMemoryFileSystem.prototype.remove = function (path) {
                    var canonicalPath = this.getCanonicalPath(path);
                    if (this.canonicalPathExists(canonicalPath)) {
                        var partialFileSystem = this.directories;
                        var lastChunk = null;
                        for (var chunkPosition = 0; chunkPosition < canonicalPath.length; chunkPosition++) {
                            lastChunk = canonicalPath[chunkPosition];
                            if (chunkPosition < canonicalPath.length - 1) {
                                partialFileSystem = partialFileSystem[lastChunk];
                            }
                        }
                        delete partialFileSystem[lastChunk];
                    }
                    throw new Error(path + " does not exist");
                };
                InMemoryFileSystem.prototype.add = function (path, file) {
                    var canonicalPath = this.getCanonicalPath(path);
                    var fileNode = this.getFileByCanonicalPath(canonicalPath);
                    if (!fileNode.isDir) {
                        throw new Error(path + " is not a directory");
                    }
                    if (this.canonicalPathExists(canonicalPath.concat([file.name]))) {
                        throw new Error(file.name + " already exists under " + path);
                    }
                    var partialFileSystem = this.directories;
                    for (var _i = 0, canonicalPath_1 = canonicalPath; _i < canonicalPath_1.length; _i++) {
                        var chunk = canonicalPath_1[_i];
                        partialFileSystem = partialFileSystem[chunk];
                    }
                    partialFileSystem[file.name] = file.getContents();
                };
                InMemoryFileSystem.prototype.canonicalPathExists = function (canonicalPath) {
                    var partialFileSystem = this.directories;
                    for (var _i = 0, canonicalPath_2 = canonicalPath; _i < canonicalPath_2.length; _i++) {
                        var chunk = canonicalPath_2[_i];
                        partialFileSystem = partialFileSystem[chunk] || null;
                        if (partialFileSystem === null) {
                            return false;
                        }
                    }
                    return true;
                };
                InMemoryFileSystem.prototype.getFileByCanonicalPath = function (canonicalPath) {
                    var partialFileSystem = this.directories;
                    var lastChunk = null;
                    for (var chunkPosition = 0; chunkPosition < canonicalPath.length; chunkPosition++) {
                        lastChunk = canonicalPath[chunkPosition];
                        if (chunkPosition < canonicalPath.length - 1) {
                            partialFileSystem = partialFileSystem[lastChunk];
                        }
                    }
                    return this.getFileNodeFromFileSystem(lastChunk, partialFileSystem[lastChunk]);
                };
                InMemoryFileSystem.prototype.getFileNodeFromFileSystem = function (name, fileData) {
                    if (name === null) {
                        name = '/';
                        fileData = this.directories;
                    }
                    switch (typeof fileData) {
                        case 'object':
                            return new DirNode_1.default(name, this.getDirectoryChildren(fileData));
                        case 'function':
                            return new ExecutableFileNode_1.default(name, fileData);
                        case 'string':
                            return new TextFileNode_1.default(name, fileData);
                    }
                    throw new Error("Unsupported object " + name + " -> " + typeof fileData + " in filesystem");
                };
                InMemoryFileSystem.prototype.getDirectoryChildren = function (fileSystem) {
                    var children = {};
                    for (var child in fileSystem) {
                        children[child] = this.getFileNodeFromFileSystem(child, fileSystem[child]);
                    }
                    return children;
                };
                InMemoryFileSystem.prototype.getCanonicalPath = function (path) {
                    if (path === null) {
                        path = this.getCwd();
                    }
                    var canonicalPath = [];
                    if (path[0] !== this.directorySeparator) {
                        canonicalPath = this.currentWorkingDirectory.slice();
                    }
                    var chunks = path.split(this.directorySeparator);
                    for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
                        var chunk = chunks_1[_i];
                        switch (chunk) {
                            case '':
                            case '.':
                                continue;
                            case '..':
                                canonicalPath.pop();
                                break;
                            default:
                                canonicalPath.push(chunk);
                                break;
                        }
                    }
                    return canonicalPath;
                };
                return InMemoryFileSystem;
            }());
            exports_16("default", InMemoryFileSystem);
        }
    };
});
System.register("files", [], function (exports_17, context_17) {
    "use strict";
    var openUrl, files;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [],
        execute: function () {
            openUrl = function (url) {
                location.assign(url);
            };
            files = {
                'www': {
                    'aerolit.pl': openUrl.bind(this, 'https://aerolit.pl/'),
                    'montypython': openUrl.bind(this, 'https://montypython.aerolit.pl/'),
                    'niemen': openUrl.bind(this, 'https://niemen.aerolit.pl/forum/'),
                    'osjan': openUrl.bind(this, 'https://osjan.aerolit.pl/'),
                },
                'sites': {
                    'hosted': {
                        'pikantnasztuka': openUrl.bind(this, 'https://pikantnasztuka.aerolit.pl/'),
                        'dziwnonoc': openUrl.bind(this, 'https://dziwnonoc.aerolit.pl/')
                    },
                    'external': {}
                },
                'readme.txt': 'Hello world!',
            };
            exports_17("default", files);
        }
    };
});
System.register("Command/ICommand", [], function (exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Command/ICommandCollection", [], function (exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Command/Help", [], function (exports_20, context_20) {
    "use strict";
    var Help;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [],
        execute: function () {
            Help = (function () {
                function Help(commands) {
                    this.commands = commands;
                }
                Help.prototype.showHelp = function (terminal) {
                    terminal.printLn('Built in help');
                    terminal.printLn('Usage:');
                    terminal.printLn(' help           - shows all commands');
                    terminal.printLn(' help <command> - shows help for command');
                };
                Help.prototype.execute = function (args, terminal) {
                    if (args.length > 0) {
                        this.showCommandHelp(args[0], terminal);
                    }
                    else {
                        this.showSelfHelp(terminal);
                    }
                };
                Help.prototype.showCommandHelp = function (commandName, terminal) {
                    var command = this.commands[commandName] || null;
                    if (command) {
                        command.showHelp(terminal);
                    }
                    else {
                        terminal.printLn('Unknown command: ' + command);
                    }
                };
                Help.prototype.showSelfHelp = function (terminal) {
                    terminal.print('Commands: ');
                    for (var commandName in this.commands) {
                        terminal.print(commandName + ' ');
                    }
                    terminal.printLn('Type help <command name> for details');
                };
                return Help;
            }());
            exports_20("default", Help);
        }
    };
});
System.register("Command/Ls", [], function (exports_21, context_21) {
    "use strict";
    var Ls;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [],
        execute: function () {
            Ls = (function () {
                function Ls(fileSystem) {
                    this.fileSystem = fileSystem;
                }
                Ls.prototype.showHelp = function (terminal) {
                    terminal.printLn('ls - list contents of current directory');
                };
                Ls.prototype.execute = function (args, terminal) {
                    if (!this.fileSystem.exists(args[0] || null)) {
                        terminal.printLn("ls: cannot access '" + args[0] + "': No such file or directory");
                        return;
                    }
                    var file = this.fileSystem.getFile(args[0] || null);
                    if (file.isDir) {
                        var children = file.getContents();
                        for (var child in children) {
                            this.printFileName(children[child], terminal);
                        }
                    }
                    else {
                        this.printFileName(file, terminal);
                    }
                };
                Ls.prototype.printFileName = function (file, terminal) {
                    terminal.printLn(file.name, this.getFileClassName(file));
                };
                Ls.prototype.getFileClassName = function (file) {
                    if (file.isDir) {
                        return 'file-dir';
                    }
                    if (file.isExecutable) {
                        return 'file-executable';
                    }
                    return '';
                };
                return Ls;
            }());
            exports_21("default", Ls);
        }
    };
});
System.register("Command/BuiltInCommands", ["Command/Help", "Command/Ls"], function (exports_22, context_22) {
    "use strict";
    var Help_1, Ls_1, BuiltInCommands;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (Help_1_1) {
                Help_1 = Help_1_1;
            },
            function (Ls_1_1) {
                Ls_1 = Ls_1_1;
            }
        ],
        execute: function () {
            BuiltInCommands = (function () {
                function BuiltInCommands(fileSystem) {
                    this.help = new Help_1.default(this);
                    this.ls = new Ls_1.default(fileSystem);
                }
                return BuiltInCommands;
            }());
            exports_22("default", BuiltInCommands);
        }
    };
});
System.register("Command/CommandLineParser", [], function (exports_23, context_23) {
    "use strict";
    var CommandLineParser;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [],
        execute: function () {
            CommandLineParser = (function () {
                function CommandLineParser(commands, fileSystem) {
                    this.commands = commands;
                    this.fileSystem = fileSystem;
                }
                CommandLineParser.prototype.isBuiltIn = function (command) {
                    return (this.commands[command] || null) !== null;
                };
                CommandLineParser.prototype.isExecutable = function (command) {
                    return this.fileSystem.exists(command) &&
                        this.fileSystem.getFile(command).isExecutable;
                };
                CommandLineParser.prototype.handle = function (input) {
                    var chunks = input.split(/\s+/);
                    var command = chunks.shift();
                    var args = chunks.slice();
                    if (this.isBuiltIn(command)) {
                        return this.commands[command].execute.bind(this.commands[command], args);
                    }
                    else if (this.isExecutable(command)) {
                        return this.fileSystem.getFile(command).getContents().bind(null, args);
                    }
                    else {
                        return function (terminal) {
                            terminal.printLn(command + ': command not found');
                        };
                    }
                };
                return CommandLineParser;
            }());
            exports_23("default", CommandLineParser);
        }
    };
});
System.register("bootstrap", ["Terminal/SimpleTerminal", "Prompt/PromptWithCwd", "FileSystem/InMemoryFileSystem", "files", "Command/BuiltInCommands", "Command/CommandLineParser", "Terminal/Terminal"], function (exports_24, context_24) {
    "use strict";
    var SimpleTerminal_1, PromptWithCwd_1, InMemoryFileSystem_1, files_1, BuiltInCommands_1, CommandLineParser_1, Terminal_1, fileSystem, prompt, commands, commandLineParser, terminal;
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [
            function (SimpleTerminal_1_1) {
                SimpleTerminal_1 = SimpleTerminal_1_1;
            },
            function (PromptWithCwd_1_1) {
                PromptWithCwd_1 = PromptWithCwd_1_1;
            },
            function (InMemoryFileSystem_1_1) {
                InMemoryFileSystem_1 = InMemoryFileSystem_1_1;
            },
            function (files_1_1) {
                files_1 = files_1_1;
            },
            function (BuiltInCommands_1_1) {
                BuiltInCommands_1 = BuiltInCommands_1_1;
            },
            function (CommandLineParser_1_1) {
                CommandLineParser_1 = CommandLineParser_1_1;
            },
            function (Terminal_1_1) {
                Terminal_1 = Terminal_1_1;
            }
        ],
        execute: function () {
            fileSystem = new InMemoryFileSystem_1.default(files_1.default);
            prompt = new PromptWithCwd_1.default(fileSystem, 'aerolit.pl [', ']$ ');
            commands = new BuiltInCommands_1.default(fileSystem);
            commandLineParser = new CommandLineParser_1.default(commands, fileSystem);
            terminal = new SimpleTerminal_1.default(prompt, commandLineParser, new Terminal_1.default());
            terminal.renderTo(document.getElementById('main'));
            terminal.start();
        }
    };
});
//# sourceMappingURL=main.js.map