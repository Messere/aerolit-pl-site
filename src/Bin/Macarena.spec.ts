import macarena from "./Macarena";

describe("Macarena", () => {
    let terminalSpy;

    beforeEach(() => {
        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn", "clear"]);
    });

    it("should show something on terminal", async () => {
        await macarena([], terminalSpy, 200);
        expect(terminalSpy.printLn).toHaveBeenCalled();
        expect(terminalSpy.clear).toHaveBeenCalled();
    });
});
