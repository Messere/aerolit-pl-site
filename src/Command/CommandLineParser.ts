import ICommandCollection from "./ICommandCollection";
import IFileSystem from "../FileSystem/IFileSystem";
import ITerminalCommand from "./ITerminalCommand";
import ITerminal from "../Terminal/ITerminal";
import ICommandLineParser from "./ICommandLineParser";

export default class CommandLineParser implements ICommandLineParser {
    private commands: ICommandCollection;
    private fileSystem: IFileSystem;

    constructor(commands : ICommandCollection, fileSystem: IFileSystem) {
        this.commands = commands;
        this.fileSystem = fileSystem;
    }

    private isBuiltIn(command: string) : boolean {
        return (this.commands[command] || null) !== null;
    }

    private isExecutable(command: string) : boolean {
        return this.fileSystem.exists(command) &&
            this.fileSystem.getFile(command).isExecutable
    }

    handle(input: string) : ITerminalCommand {

        const chunks = input.split(/\s+/);
        const command = chunks.shift();
        const args = [...chunks];

        if (this.isBuiltIn(command)) {
            return this.commands[command].execute.bind(
                this.commands[command],
                args
            );
        } else if (this.isExecutable(command)) {
            return this.fileSystem.getFile(command).getContents().bind(
                null,
                args
            )
        } else {
            return (terminal: ITerminal) => {
                terminal.printLn(command + ': command not found');
            }
        }
    }
}
