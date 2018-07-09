import * as fetchMock from "fetch-mock";
import InMemoryFileSystem from "../FileSystem/InMemoryFileSystem";
import WgetCommand from "./WgetCommand";

describe("Wget command", () => {
    let wgetCommand;
    let terminalSpy;
    let fileSystem;

    beforeEach(() => {
        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn"]);
        fileSystem = new InMemoryFileSystem({
            dir: {},
            file: "test",
        });
        wgetCommand = new WgetCommand(fileSystem);
        fetchMock.restore();
    });

    it("should print help to terminal", () => {
        wgetCommand.showHelp(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalled();
    });

    it("should print an error if called without arguments", async () => {
        await wgetCommand.execute([], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("wget: missing url");
    });

    it("should print an error if second argument points to already existing file", async () => {
        await wgetCommand.execute(["http://test.com", "/file"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("wget: /file already exists");

        await wgetCommand.execute(["http://test.com", "/dir"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("wget: /dir already exists");
    });

    it("should print an error if parent directory of second argument is a file", async () => {
        await wgetCommand.execute(["http://test.com", "/file/test.txt"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("wget: /file: is not a directory");
    });

    it("should print an error if parent directory of second argument does not exist", async () => {
        await wgetCommand.execute(["http://test.com", "/dir2/test.txt"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("wget: /dir2/test.txt: invalid path");
    });

    it("should print an error if fetch fails", async () => {
        fetchMock.get("http://test.com", {
            throws: new Error("fetch failed you"),
        });
        await wgetCommand.execute(["http://test.com"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("wget: fetch failed you");
    });

    it("should print an error if fetch returns with no-success status", async () => {
        fetchMock.get("http://test.com", {
            status: 500,
        });
        await wgetCommand.execute(["http://test.com"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("wget: Internal Server Error");
    });

    it("should fetch url and display it on the terminal", async () => {
        fetchMock.get("http://test.com", "hooray!");
        await wgetCommand.execute(["http://test.com"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("hooray!");
    });

    it("should fetch url and save it to the file", async () => {
        fetchMock.get("http://test.com", "hooray!");
        await wgetCommand.execute(["http://test.com", "/dir/output.txt"], terminalSpy);

        expect(fileSystem.exists("/dir/output.txt")).toBeTruthy();

        const file = fileSystem.getFile("/dir/output.txt");
        expect(file.getContents()).toBe("hooray!");
    });
});
