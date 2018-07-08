import ITerminal from "../Terminal/ITerminal";
import ICommand from "./ICommand";

export default class FortuneCommand implements ICommand {
    private apiEndpoint: string = "https://helloacm.com/api/fortune/";

    public showHelp(terminal: ITerminal): void {
        terminal.printLn("fortune - show random, possibly even funny, quote");
    }

    public async execute(args: string[], terminal: ITerminal): Promise<void> {
        try {
            const response = await fetch(this.apiEndpoint);
            if (response.status === 200) {
                terminal.printLn(await response.json());
            } else {
                throw new Error(response.statusText);
            }
        } catch (e) {
            terminal.printLn(`Error fetching the cookie for you: ${e.message}`);
        }
    }
}
