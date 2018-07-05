import ITerminal from "./ITerminal";
import IPrompt from "../Prompt/IPrompt";
import ICommandHandler from "./ICommandHandler";
import ICommandLineParser from "../Command/ICommandLineParser";
import Terminal from "./Terminal";

export default class SimpleTerminal implements ITerminal {
    private prompt: IPrompt;
    private terminal: Terminal;
    private commandLineParser: ICommandLineParser;

    private errorCount = 0;
    private maxErrorCount = 100;

    constructor(
        prompt: IPrompt, 
        commandLineParser: ICommandLineParser,
        terminal: any
    ) {
        this.prompt = prompt
        this.terminal = terminal;
        this.commandLineParser = commandLineParser;
    }

    print(text: string, className?: string) : void {
        this.terminal.print(text, className);
    }

    printLn(text: string, className?: string) : void {
        this.terminal.printLn(text, className);
    }

    input(commandHandler: ICommandHandler) : void {
        this.terminal.input(
            this.prompt.getPrompt(),
            commandHandler
        );
    }

    renderTo(node: HTMLElement) : void {
        node.appendChild(this.terminal.html);
    }

    private handleCommandLine(input?: string) : void {
        try {
            if (input !== null && input.trim() !== '') {
                const executableCommand = this.commandLineParser.handle(input);
                executableCommand(this);
            }
            this.printLn('');
            this.input(this.handleCommandLine.bind(this));
        } catch (e) {
            this.printLn('');
            this.printLn(e.message, 'error');
            console.debug(e);
            
            this.errorCount++;
            
            if (this.errorCount < this.maxErrorCount) {
                this.handleCommandLine(null);
            } else {
                console.debug('Too many errors, aborting')
            }
        }
    }
    
    start() : void {
        this.handleCommandLine(null);
    }
}
