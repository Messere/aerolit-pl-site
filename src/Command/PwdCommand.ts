import IFileSystem from "../FileSystem/IFileSystem";
import ITerminal from "../Terminal/ITerminal";
import ICommand from "./ICommand";

export default class PwdCommand implements ICommand {
    private fileSystem: IFileSystem;

    constructor(fileSystem: IFileSystem) {
        this.fileSystem = fileSystem;
    }

    public showHelp(terminal: ITerminal): void {
        terminal.printLn("pwd - show current working directory");
    }

    public execute(args: string[], terminal: ITerminal): void {
        terminal.printLn(this.fileSystem.getCwd());
    }
}
