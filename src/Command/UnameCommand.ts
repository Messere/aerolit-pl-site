import ICommand from "./ICommand";
import ITerminal from "../Terminal/ITerminal";

export default class UnameCommand implements ICommand {

    private uaParser: any;

    constructor(uaParser: any) {
        this.uaParser = uaParser;
    }

    showHelp(terminal: ITerminal) : void {
        terminal.printLn('uname    - shows information about the system');
        terminal.printLn('uname -a - shows detailed information about the system');
    }

    execute(args: Array<string>, terminal: ITerminal) : void {
        if (args[0] === '-a') {
            this.showDetails(terminal);
        } else {
            this.showBasic(terminal);
        }
    }

    private showDetails(terminal: ITerminal) : void {
        const os = this.uaParser.getOS().name + ' ' + this.uaParser.getOS().version;
        const cpu = this.uaParser.getCPU().architecture;
        const browser = this.uaParser.getBrowser().name + ' ' + this.uaParser.getBrowser().version;
        terminal.printLn(`${os} ${browser} ${cpu}`);
    }

    private showBasic(terminal: ITerminal) : void {
        terminal.printLn(this.uaParser.getOS().name);
    }
}
