import ICommandHandler from "./ICommandHandler";

export default interface ITerminal {
    print(text: string, className?: string): void;
    printLn(text: string, className?: string): void;
    input(commandHandler: ICommandHandler): void;
    renderTo(node: HTMLElement): void;
    start(): void;
    clear(): void;
}
