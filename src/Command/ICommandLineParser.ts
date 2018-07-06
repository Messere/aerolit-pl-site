import ITerminalCommand from "./ITerminalCommand";

export default interface ICommandLineParser {
    handle(input: string): ITerminalCommand;
}
