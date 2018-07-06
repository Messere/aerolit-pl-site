import ICommand from "./ICommand";
import ITerminal from "../Terminal/ITerminal";

export default class FortuneCommand implements ICommand {
    private apiEndpoint : string = 'https://helloacm.com/api/fortune/';

    showHelp(terminal: ITerminal) : void {
        terminal.printLn('fortune - show random, possibly even funny, quote');
    }

    execute(args: Array<string>, terminal: ITerminal) : Promise<void> {
        const promise = fetch(this.apiEndpoint).then((response) => {
            return response.json()
        }).then((text) => {
            terminal.printLn(text);
        }).catch((reason) => {
            terminal.printLn(`Error fetching the cookie for you: ${reason}`);
        });

        return promise;
    }
}