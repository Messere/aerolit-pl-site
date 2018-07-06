import ITerminal from "../Terminal/ITerminal";

export default interface ICommand {
    showHelp(terminal: ITerminal): void;
    execute(args: string[], terminal: ITerminal): void|Promise<void>;
}
