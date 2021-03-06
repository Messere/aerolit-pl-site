import DirNode from "../File/DirNode";
import IFileSystem from "../FileSystem/IFileSystem";
import ITerminal from "../Terminal/ITerminal";
import ICommand from "./ICommand";

export default class RmdirCommand implements ICommand {
    private fileSystem: IFileSystem;

    constructor(fileSystem: IFileSystem) {
        this.fileSystem = fileSystem;
    }

    public showHelp(terminal: ITerminal): void {
        terminal.printLn("rmdir <dir> - remove empty directory <dir>");
    }

    public execute(args: string[], terminal: ITerminal): void {
        const dirToRemove = args.shift();

        if (typeof dirToRemove === "undefined") {
            terminal.printLn("rmdir: missing operand");
        } else {
            if (!this.fileSystem.exists(dirToRemove)) {
                terminal.printLn(`rmdir: failed to remove '${dirToRemove}': No such file or directory`);
            } else {
                const file = this.fileSystem.getFile(dirToRemove);
                if (!file.isDir) {
                    terminal.printLn(`rmdir: failed to remove '${dirToRemove}': Not a directory`);
                } else if (!(file as DirNode).isEmpty()) {
                    terminal.printLn(`rmdir: failed to remove '${dirToRemove}': Directory not empty`);
                } else {
                    this.fileSystem.remove(dirToRemove);
                }
            }
        }
    }
}
