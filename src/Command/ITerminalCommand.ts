import ITerminal from "../Terminal/ITerminal";

type ITerminalCommand = (terminal: ITerminal) => void|Promise<void>;
export default ITerminalCommand;
