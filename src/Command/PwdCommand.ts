import ICommand from "./ICommand";
import IFileSystem from "../FileSystem/IFileSystem";
import ITerminal from "../Terminal/ITerminal";

export default class PwdCommand implements ICommand {
    private fileSystem : IFileSystem;

    constructor(fileSystem: IFileSystem) {
        this.fileSystem = fileSystem;
    }

    showHelp(terminal: ITerminal) : void {
        terminal.printLn('pwd - show current working directory');
    }

    execute(args: Array<string>, terminal: ITerminal) : void {
        terminal.printLn(this.fileSystem.getCwd());
    }
}