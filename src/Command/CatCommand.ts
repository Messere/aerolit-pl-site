import ICommand from "./ICommand";
import IFileSystem from "../FileSystem/IFileSystem";
import ITerminal from "../Terminal/ITerminal";

export default class CatCommand implements ICommand {
    private fileSystem : IFileSystem;

    constructor(fileSystem: IFileSystem) {
        this.fileSystem = fileSystem;
    }

    showHelp(terminal: ITerminal) : void {
        terminal.printLn('cat <file> - show contents of the <file>');
    }

    execute(args: Array<string>, terminal: ITerminal) : void {
        const path = args[0] || null;

        if (path === null) {
            terminal.printLn('file: missing operand');
        } else if (!this.fileSystem.exists(path)) {
            terminal.printLn(`cat: ${path}: No such file or directory`);
        } else {
            const file = this.fileSystem.getFile(path);
            if (file.isDir) {
                terminal.printLn(`cat: ${path}: Is a directory`);
            } else {
                terminal.printLn(file.getContents().toString());
            }
        }
    }
}