import IFileSystem from "../FileSystem/IFileSystem";
import ITerminal from "../Terminal/ITerminal";
import ICommand from "./ICommand";

export default class CdCommand implements ICommand {
    private fileSystem: IFileSystem;

    constructor(fileSystem: IFileSystem) {
        this.fileSystem = fileSystem;
    }

    public showHelp(terminal: ITerminal): void {
        terminal.printLn("cd <dir> - changes current working directory to <dir>");
        terminal.printLn("cd       - changes current directory to /");
    }

    public execute(args: string[], terminal: ITerminal): void {
        if (args.length === 0) {
            this.fileSystem.setCwd("/");
        } else if (!this.fileSystem.exists(args[0])) {
            terminal.printLn(`cd: ${args[0]}: No such file or directory`);
        } else {
            const file = this.fileSystem.getFile(args[0]);
            if (file.isDir) {
                this.fileSystem.setCwd(args[0]);
            } else {
                terminal.printLn(`cd: ${args[0]}: Not a directory`);
            }
        }
    }
}
