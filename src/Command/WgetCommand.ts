import ICommand from "./ICommand";
import ITerminal from "../Terminal/ITerminal";
import IFileSystem from "../FileSystem/IFileSystem";
import TextFileNode from "../File/TextFileNode";
import IValidatedArgs from "./IValidatedArgs";

export default class WgetCommand implements ICommand {
    private fileSystem : IFileSystem;

    constructor(fileSystem: IFileSystem) {
        this.fileSystem = fileSystem;
    }

    showHelp(terminal: ITerminal) : void {
        terminal.printLn('wget <url>       - retrieve and print url contents');
        terminal.printLn('wget <url> <file - retrieve url contents and save it to file');
        terminal.printLn('Note that cross origin request restrictions apply.');
    }

    private saveTextFile(dir: string, name: string, contents: string) : void {
        const newFile = new TextFileNode(name, contents);
        this.fileSystem.add(dir, newFile);
    }

    private validateArgs(args: Array<string>) : IValidatedArgs {
        const url = args[0] || null;
        const file = args[1] || null;

        const result = {
            valid: false,
            saveToFile: false,
            url: url
        } as IValidatedArgs;

        if (url === null) {
            result.errorMessage = 'missing url';            
        } else if (file !== null && this.fileSystem.exists(file)) {
            result.errorMessage = `${file} already exists`;
        } else if (file !== null) {

            const chunks = file.split('/');
            const name = chunks.pop();
            const dir = '/' + chunks.join('/');
    
            if (!this.fileSystem.exists(dir)) {
                result.errorMessage = `${file}: invalid path`;
            } else {
                const fileNode = this.fileSystem.getFile(dir);
                if (!fileNode.isDir) {
                    result.errorMessage = `${dir}: is not a directory`;
                } else {
                    result.valid = true,
                    result.saveToFile = true,
                    result.dir = dir,
                    result.name = name
                }
            }
        } else {
            result.valid = true;
        }

        return result;
    }

    execute(args: Array<string>, terminal: ITerminal) : Promise<void> {
        const validatedArgs = this.validateArgs(args);
        
        if (!validatedArgs.valid) {
            terminal.printLn(`wget: ${validatedArgs.errorMessage}`);
            return
        }

        return fetch(validatedArgs.url).then((result) => {
            return result.text();
        }).then((text) => {
            if (validatedArgs.saveToFile) {
                this.saveTextFile(validatedArgs.dir, validatedArgs.name, text);
            } else {
                terminal.printLn(text);
            }
        }).catch((reason) => {
            terminal.printLn(reason)
        });
    }
}
