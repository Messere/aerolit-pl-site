import InMemoryFileSystem from "../FileSystem/InMemoryFileSystem";
import CatCommand from "./CatCommand";

describe("Cat command", () => {
    let catCommand;
    let fileSystem;
    let terminalSpy;

    beforeEach(() => {
        fileSystem = new InMemoryFileSystem({
            "dirName": {},
            "testFile.txt": "foo bar",
        });

        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn"]);

        catCommand = new CatCommand(fileSystem);
    });

    it("should print help to terminal", () => {
        catCommand.showHelp(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalled();
    });

    it("should require argument", () => {
        catCommand.execute([], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "file: missing operand",
        );
    });

    it("should require existing file", () => {
        catCommand.execute(["testFile2.txt"], terminalSpy);

        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "cat: testFile2.txt: No such file or directory",
        );
    });

    it("should refuse to work on directory", () => {
        catCommand.execute(["dirName"], terminalSpy);

        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "cat: dirName: Is a directory",
        );
    });

    it("should get contents of a file", () => {
        catCommand.execute(["testFile.txt"], terminalSpy);

        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "foo bar",
        );
    });
});
