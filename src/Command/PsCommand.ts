import ILocation from "../Location/ILocation";
import ITerminal from "../Terminal/ITerminal";
import IUptime from "../Uptime/IUptime";
import ICommand from "./ICommand";

export default class PsCommand implements ICommand {
    private uaParser: any;
    private uptime: IUptime;
    private location: ILocation;

    constructor(uaParser: any, uptime: IUptime, location: ILocation) {
        this.uaParser = uaParser;
        this.uptime = uptime;
        this.location = location;
    }

    public showHelp(terminal: ITerminal): void {
        terminal.printLn("ps - show process information");
    }

    public execute(args: string[], terminal: ITerminal): void {
        const uptime = this.uptime.getUptimeAsString();
        const process = `${this.uaParser.getBrowser().name} ${this.location.getHref()}`;

        terminal.printLn("PID     TIME CMD");
        terminal.printLn(`  1 ${uptime} ${process}`);
    }
}
