import ITerminal from "../Terminal/ITerminal";

export default interface ITerminalCommand {
    (terminal: ITerminal): void;
}
