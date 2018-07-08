import InMemoryFileSystem from "../FileSystem/InMemoryFileSystem";
import CdCommand from "./CdCommand";

describe("Change directory command", () => {
    let cdCommand;
    let fileSystem;
    let terminalSpy;

    beforeEach(() => {
        fileSystem = new InMemoryFileSystem({
            dir1: {},
            dir2: {},
            file: "test",
        });
        cdCommand = new CdCommand(fileSystem);
        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn"]);
    });

    it("should go to root directory when invoked without parameters", () => {
        fileSystem.setCwd("/dir1");
        cdCommand.execute([], terminalSpy);
        expect(fileSystem.getCwd()).toBe("/");
    });

    it("should change current directory to specified one", () => {
        fileSystem.setCwd("/dir2");
        cdCommand.execute(["../dir1"], terminalSpy);
        expect(fileSystem.getCwd()).toBe("/dir1");
    });

    it("should display error when trying to cd to non-existent file", () => {
        cdCommand.execute(["/dir3"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "cd: /dir3: No such file or directory",
        );
    });

    it("should display error when trycin to cd to file that is not a directory", () => {
        cdCommand.execute(["/file"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "cd: /file: Not a directory",
        );
    });

    it("should print help to terminal", () => {
        cdCommand.showHelp(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalled();
    });
});
