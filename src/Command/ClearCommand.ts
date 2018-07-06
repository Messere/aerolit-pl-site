import ICommand from "./ICommand";
import ITerminal from "../Terminal/ITerminal";

export default class ClearCommand implements ICommand {
    showHelp(terminal: ITerminal) : void {
        terminal.printLn('clear - clears the screen');
    }

    execute(args: Array<string>, terminal: ITerminal) : void {
        terminal.clear();
    }
}