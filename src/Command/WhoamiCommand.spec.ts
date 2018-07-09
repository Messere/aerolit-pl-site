import WhoamiCommand from "./WhoamiCommand";

describe("Whoami command", () => {
    let whoamiCommand;
    let terminalSpy;

    beforeEach(() => {
        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn"]);
        whoamiCommand = new WhoamiCommand();
    });

    it("should print help to terminal", () => {
        whoamiCommand.showHelp(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalled();
    });

    it("should try to be funny", () => {
        whoamiCommand.execute([], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("How should I know?");
    });
});
