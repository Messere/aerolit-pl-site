import ICommand from "./ICommand";
import ITerminal from "../Terminal/ITerminal";

export default class WhoamiCommand implements ICommand {
    showHelp(terminal: ITerminal) : void {
        terminal.printLn('whoami - print the user name');
    }

    execute(args: Array<string>, terminal: ITerminal) : void {
        terminal.printLn('How should I know?');
    }
}