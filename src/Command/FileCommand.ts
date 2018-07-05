import ICommand from "./ICommand";
import IFileSystem from "../FileSystem/IFileSystem";
import ITerminal from "../Terminal/ITerminal";

export default class FileCommand implements ICommand {
    private fileSystem : IFileSystem;

    constructor(fileSystem: IFileSystem) {
        this.fileSystem = fileSystem;
    }

    showHelp(terminal: ITerminal) : void {
        terminal.printLn('file <path> - show file type');
    }

    execute(args: Array<string>, terminal: ITerminal) : void {
        const path = args[0] || null;

        if (path === null) {
            terminal.printLn('file: missing operand');
        } else if (!this.fileSystem.exists(path)) {
            terminal.printLn(`${path}: cannot open \` ${path}' (No such file or directory)`);
        } else {
            const file = this.fileSystem.getFile(path);

            if (file.isDir) {
                terminal.printLn(`${path}: directory`);
            } else if (file.isExecutable) {
                terminal.printLn(`${path}: ECMAScript executable`);
            } else {
                terminal.printLn(`${path}: text file`);
            }
        }
    }
}