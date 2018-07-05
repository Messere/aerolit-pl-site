import ICommand from "./ICommand";
import ITerminal from "../Terminal/ITerminal";
import IFileSystem from "../FileSystem/IFileSystem";
import IFileNode from "../File/IFileNode";
import IFileNodeCollection from "../File/IFileNodeCollection";

export default class LsCommand implements ICommand {

    private fileSystem : IFileSystem;

    constructor(fileSystem: IFileSystem) {
        this.fileSystem = fileSystem;
    }

    showHelp(terminal: ITerminal) : void {
        terminal.printLn('ls - list contents of current directory');
    }

    execute(args: Array<string>, terminal: ITerminal) : void {

        if (!this.fileSystem.exists(args[0] || null)) {
            terminal.printLn(`ls: cannot access '${args[0]}': No such file or directory`)
            return;
        }

        const file = this.fileSystem.getFile(args[0] || null);

        if (file.isDir) {
            const children = file.getContents() as IFileNodeCollection;
            for (const child in children) {
                this.printFileName(children[child], terminal);
            }
        } else {
            this.printFileName(file, terminal);
        }

    }

    private printFileName(file: IFileNode, terminal: ITerminal) : void {
        terminal.printLn(file.name, this.getFileClassName(file));
    }

    private getFileClassName(file: IFileNode) : string {
        if (file.isDir) {
            return 'file-dir';
        }
        if (file.isExecutable) {
            return 'file-executable';
        }
        return '';
    }
}
