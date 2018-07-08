import * as fetchMock from "fetch-mock";
import FortuneCommand from "./FortuneCommand";

describe("Fortune command", () => {
    let fortuneCommand;
    let terminalSpy;

    beforeEach(() => {
        fortuneCommand = new FortuneCommand();
        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn"]);
        fetchMock.restore();
    });

    it("should print help to terminal", () => {
        fortuneCommand.showHelp(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalled();
    });

    it("should fetch and display fortune", async () => {
        const fortune = "Some smart fortune";
        fetchMock.get("https://helloacm.com/api/fortune/", JSON.stringify(fortune));
        await fortuneCommand.execute([], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(fortune);
    });

    it("should display error if cannot fetch fortune", async () => {
        fetchMock.get("https://helloacm.com/api/fortune/", {
            status: 500,
        });
        await fortuneCommand.execute([], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "Error fetching the cookie for you: Internal Server Error",
        );
    });
});
