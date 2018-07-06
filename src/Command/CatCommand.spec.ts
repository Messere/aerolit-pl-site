import "jasmine";
import DirNode from "../File/DirNode";
import TextFileNode from "../File/TextFileNode";
import CatCommand from "./CatCommand";

describe("Cat command", () => {
    let catCommand;
    let fileSystemMock;
    let terminalSpy;

    beforeEach(() => {
        fileSystemMock = {
            exists: () => null,
            getFile: () => null,
        };

        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn"]);

        catCommand = new CatCommand(fileSystemMock);
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
        spyOn(fileSystemMock, "exists").and.returnValue(false);

        catCommand.execute(["testFile.txt"], terminalSpy);

        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "cat: testFile.txt: No such file or directory",
        );
    });

    it("should refuse to work on directory", () => {
        spyOn(fileSystemMock, "exists").and.returnValue(true);
        spyOn(fileSystemMock, "getFile").and.returnValue(
            new DirNode("dirName", {}),
        );

        catCommand.execute(["dirName"], terminalSpy);

        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "cat: dirName: Is a directory",
        );
    });

    it("should get contents of a file", () => {
        spyOn(fileSystemMock, "exists").and.returnValue(true);
        spyOn(fileSystemMock, "getFile").and.returnValue(
            new TextFileNode("testFile.txt", "foo bar"),
        );

        catCommand.execute(["testFile.txt"], terminalSpy);

        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "foo bar",
        );
    });
});
