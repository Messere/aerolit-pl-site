import ClearCommand from "./ClearCommand";

describe("Clear command", () => {
    let clearCommand;
    let terminalSpy;

    beforeAll(() => {
        clearCommand = new ClearCommand();
        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn", "clear"]);
    });

    it("should print help to terminal", () => {
        clearCommand.showHelp(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalled();
    });

    it("should clear terminal", () => {
        clearCommand.execute([], terminalSpy);
        expect(terminalSpy.clear).toHaveBeenCalled();
    });
});
