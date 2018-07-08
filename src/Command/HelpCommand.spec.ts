import ITerminal from "../Terminal/ITerminal";
import HelpCommand from "./HelpCommand";

describe("Help command", () => {
    let helpCommand;
    let builtInCommands;
    let terminalSpy;

    beforeEach(() => {
        builtInCommands = {
            ping: {
                showHelp: (terminal: ITerminal): void => {
                    terminal.printLn("am I helping?");
                },
            },
        };
        helpCommand = new HelpCommand(builtInCommands);
        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn", "print"]);
    });

    it("should print help to terminal", () => {
        helpCommand.showHelp(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalled();
    });

    it("should display list of all commands if called without arguments", () => {
        helpCommand.execute([], terminalSpy);
        expect(terminalSpy.print).toHaveBeenCalledWith("ping ");
    });

    it("should display help for ping command", () => {
        helpCommand.execute(["ping"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("am I helping?");
    });

    it("should display error if command does not exist", () => {
        helpCommand.execute(["zonk"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("Unknown command: zonk");
    });
});
