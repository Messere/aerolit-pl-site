import ITerminal from "../Terminal/ITerminal";
import ICommand from "./ICommand";

export default class WhoamiCommand implements ICommand {
    public showHelp(terminal: ITerminal): void {
        terminal.printLn("whoami - print the user name");
    }

    public execute(args: string[], terminal: ITerminal): void {
        terminal.printLn("How should I know?");
    }
}
