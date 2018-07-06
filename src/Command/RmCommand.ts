import IFileSystem from "../FileSystem/IFileSystem";
import ITerminal from "../Terminal/ITerminal";
import ICommand from "./ICommand";

export default class RmCommand implements ICommand {
    private fileSystem: IFileSystem;

    constructor(fileSystem: IFileSystem) {
        this.fileSystem = fileSystem;
    }

    public showHelp(terminal: ITerminal): void {
        terminal.printLn("rm <file>        - remove <file>");
        terminal.printLn("rm -r <dir|file> - remove directories recursively");
    }

    public execute(args: string[], terminal: ITerminal): void {
        const firstOption = args.shift();
        const force = firstOption === "-r";
        const fileToRemove = force ? args.shift() : firstOption;

        if (typeof fileToRemove === "undefined") {
            terminal.printLn("rm: missing operand");
        } else {
            if (!this.fileSystem.exists(fileToRemove)) {
                terminal.printLn(`rm: cannot remove '${fileToRemove}': No such file or directory`);
            } else {
                const file = this.fileSystem.getFile(fileToRemove);
                if (!file.isDir || force) {
                    this.fileSystem.remove(fileToRemove);
                } else {
                    terminal.printLn(`rm: cannot remove '${fileToRemove}': Is a directory`);
                }
            }
        }
    }
}
