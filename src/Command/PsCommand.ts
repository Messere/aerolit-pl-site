import ITerminal from "../Terminal/ITerminal";
import IUptime from "../Uptime/IUptime";
import ICommand from "./ICommand";

export default class PsCommand implements ICommand {
    private uaParser: any;
    private uptime: IUptime;

    constructor(uaParser: any, uptime: IUptime) {
        this.uaParser = uaParser;
        this.uptime = uptime;
    }

    public showHelp(terminal: ITerminal): void {
        terminal.printLn("ps - show process information");
    }

    public execute(args: string[], terminal: ITerminal): void {
        const uptime = this.uptime.getUptimeAsString();
        const process = `${this.uaParser.getBrowser().name} ${document.location.href}`;

        terminal.printLn(`PID     TIME CMD`);
        terminal.printLn(`  1 ${uptime} ${process}`);
    }
}
