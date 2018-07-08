import ITerminal from "../Terminal/ITerminal";
import ICommand from "./ICommand";
import ICommandCollection from "./ICommandCollection";

export default class HelpCommand implements ICommand {
    private commands: ICommandCollection;

    constructor(commands: ICommandCollection) {
        this.commands = commands;
    }

    public showHelp(terminal: ITerminal): void {
        terminal.printLn("Built in help");
        terminal.printLn("Usage:");
        terminal.printLn(" help           - shows all commands");
        terminal.printLn(" help <command> - shows help for command");
    }

    public execute(args: string[], terminal: ITerminal): void {
        if (args.length > 0) {
            this.showCommandHelp(args[0], terminal);
        } else {
            this.showSelfHelp(terminal);
        }
    }

    private showCommandHelp(commandName: string, terminal: ITerminal) {
        const command = this.commands[commandName] || null;
        if (command) {
            command.showHelp(terminal);
        } else {
            terminal.printLn(`Unknown command: ${commandName}`);
        }
    }

    private showSelfHelp(terminal: ITerminal) {
        terminal.printLn("");
        terminal.print("Commands: ");
        for (const commandName of Object.keys(this.commands)) {
            terminal.print(commandName + " ");
        }
        terminal.printLn("Type help <command name> for details");
    }
}
