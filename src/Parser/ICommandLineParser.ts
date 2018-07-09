import ITerminalCommand from "../Command/ITerminalCommand";

export default interface ICommandLineParser {
    handle(input: string): ITerminalCommand;
}
