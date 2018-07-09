import UnameCommand from "./UnameCommand";

describe("Uname command", () => {
    let unameCommand;
    let uaParserMock;
    let terminalSpy;

    beforeEach(() => {
        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn"]);
        uaParserMock = {
            getBrowser: () => {
                return {
                    name: "Hyperlink",
                    version: "2.5e",
                };
            },
            getCPU: () => {
                return {
                    architecture: "MOS Technology 6510",
                };
            },
            getOS: () => {
                return {
                    name: "Commodore",
                    version: "64",
                };
            },
        };
        unameCommand = new UnameCommand(uaParserMock);
    });

    it("should print help to terminal", () => {
        unameCommand.showHelp(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalled();
    });

    it("should display OS name", () => {
        unameCommand.execute([], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("Commodore");
    });

    it("should display detailed information", () => {
        unameCommand.execute(["-a"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "Commodore 64 Hyperlink 2.5e MOS Technology 6510",
        );
    });
});
