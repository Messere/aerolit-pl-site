import ICommand from "./ICommand";
import ITerminal from "../Terminal/ITerminal";

export default class FortuneCommand implements ICommand {
    private apiEndpoint : string = 'https://helloacm.com/api/fortune/';

    showHelp(terminal: ITerminal) : void {
        terminal.printLn('fortune - show random, possibly even funny, quote');
    }

    private formatFortune(fortune: string) : Array<string> {
        let fortuneLines = fortune.split(/\n/);
        return fortuneLines;
    }

    execute(args: Array<string>, terminal: ITerminal) : Promise<void> {
        const promise = fetch(this.apiEndpoint).then((response) => {
            return response.json()
        }).then((text) => {
            this.formatFortune(text).forEach((line) => terminal.printLn(line));
        });

        return promise;
    }
}