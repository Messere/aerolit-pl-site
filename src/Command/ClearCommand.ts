import ITerminal from "../Terminal/ITerminal";
import ICommand from "./ICommand";

export default class ClearCommand implements ICommand {
    public showHelp(terminal: ITerminal): void {
        terminal.printLn("clear - clears the screen");
    }

    public execute(args: string[], terminal: ITerminal): void {
        terminal.clear();
    }
}
