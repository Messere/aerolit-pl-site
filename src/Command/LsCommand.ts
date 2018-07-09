import IFileNode from "../File/IFileNode";
import IFileNodeCollection from "../File/IFileNodeCollection";
import IFileSystem from "../FileSystem/IFileSystem";
import ITerminal from "../Terminal/ITerminal";
import ICommand from "./ICommand";

export default class LsCommand implements ICommand {

    private fileSystem: IFileSystem;

    constructor(fileSystem: IFileSystem) {
        this.fileSystem = fileSystem;
    }

    public showHelp(terminal: ITerminal): void {
        terminal.printLn("ls - list contents of current directory");
    }

    public execute(args: string[], terminal: ITerminal): void {
        const filePath = args[0] || this.fileSystem.getCwd();

        if (!this.fileSystem.exists(filePath)) {
            terminal.printLn(`ls: cannot access '${filePath}': No such file or directory`);
            return;
        }

        const file = this.fileSystem.getFile(filePath);

        if (file.isDir) {
            const children = file.getContents() as IFileNodeCollection;
            for (const child of Object.keys(children)) {
                this.printFileName(children[child], terminal);
            }
        } else {
            this.printFileName(file, terminal);
        }

    }

    private printFileName(file: IFileNode, terminal: ITerminal): void {
        terminal.printLn(file.name, this.getFileClassName(file));
    }

    private getFileClassName(file: IFileNode): string {
        if (file.isDir) {
            return "file-dir";
        }
        if (file.isExecutable) {
            return "file-executable";
        }
        return "";
    }
}
