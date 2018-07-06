import ITerminal from "../Terminal/ITerminal";
import ICommand from "./ICommand";

export default class FortuneCommand implements ICommand {
    private apiEndpoint: string = "https://helloacm.com/api/fortune/";

    public showHelp(terminal: ITerminal): void {
        terminal.printLn("fortune - show random, possibly even funny, quote");
    }

    public execute(args: string[], terminal: ITerminal): Promise<void> {
        const promise = fetch(this.apiEndpoint).then((response) => {
            return response.json();
        }).then((text) => {
            terminal.printLn(text);
        }).catch((reason) => {
            terminal.printLn(`Error fetching the cookie for you: ${reason}`);
        });

        return promise;
    }
}
