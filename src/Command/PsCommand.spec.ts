import PsCommand from "./PsCommand";

describe("Ps command", () => {
    let psCommand;
    let terminalSpy;
    let uaParserMock;
    let uptimeMock;
    let locationMock;

    beforeEach(() => {
        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn"]);
        uaParserMock = {
            getBrowser: () => {
                return {
                    name: "Browser",
                };
            },
        };
        uptimeMock = {
            getUptimeAsString: () => "forever",
        };
        locationMock = {
            getHref: () => "https://my.site",
        };
        psCommand = new PsCommand(uaParserMock, uptimeMock, locationMock);
    });

    it("should print help to terminal", () => {
        psCommand.showHelp(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalled();
    });

    it("should show one process", () => {
        psCommand.execute([], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "PID     TIME CMD",
        );
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "  1 forever Browser https://my.site",
        );
    });
});
