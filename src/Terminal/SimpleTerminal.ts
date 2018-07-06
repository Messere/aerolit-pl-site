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

    private handleException(e: Error) {
        this.printLn('');
        this.printLn(e.message, 'error');
        console.debug(e);
        
        // stop processing input if too many errors
        // to avoid infinite loop
        this.errorCount++;        
        if (this.errorCount < this.maxErrorCount) {
            this.handleCommandLine(null);
        } else {
            console.debug('Too many errors, aborting')
        }
    }

    private handleCommandLine(input?: string) : void {
        try {
            this.printLn('');
            if (input !== null && input.trim() !== '') {
                const executableCommand = this.commandLineParser.handle(input);
                const promise = executableCommand(this);

                if (typeof promise === 'undefined') {
                    this.input(this.handleCommandLine.bind(this));    
                } else {
                    promise.then(() => {
                        this.input(this.handleCommandLine.bind(this));
                    });
                }                
            } else {
                this.input(this.handleCommandLine.bind(this));
            }
        } catch (e) {
            this.handleException(e);
        }
    }
    
    start() : void {
        this.handleCommandLine(null);
    }

    clear() : void {
        this.terminal.clear();
    }
}
