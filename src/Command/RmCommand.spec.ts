import InMemoryFileSystem from "../FileSystem/InMemoryFileSystem";
import RmCommand from "./RmCommand";

describe("Rm command", () => {
    let rmCommand;
    let fileSystem;
    let terminalSpy;

    beforeEach(() => {
        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn"]);
        fileSystem = new InMemoryFileSystem({
            dir1: {
                dir2: {
                    file: "test",
                },
            },
            dir2: {

            },
            file: "test",
        });
        rmCommand = new RmCommand(fileSystem);
    });

    it("should print help to terminal", () => {
        rmCommand.showHelp(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalled();
    });

    it("should display error if called without arguments", () => {
        rmCommand.execute([], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "rm: missing operand",
        );
    });

    it("should display error if the only argument is recursive flag", () => {
        rmCommand.execute(["-r"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "rm: missing operand",
        );
    });

    it("should display error if attempting to remove non-existent file", () => {
        rmCommand.execute(["zonk.txt"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "rm: cannot remove 'zonk.txt': No such file or directory",
        );
    });

    it("should display error if removing directory without recursive flag", () => {
        rmCommand.execute(["/dir2"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "rm: cannot remove '/dir2': Is a directory",
        );
        expect(fileSystem.exists("/dir2")).toBeTruthy();
    });

    it("should remove a file", () => {
        rmCommand.execute(["/dir1/dir2/file"], terminalSpy);
        expect(fileSystem.exists("/dir1/dir2/file")).toBeFalsy();
    });

    it("should remove directory and all children if called with recursive flag", () => {
        rmCommand.execute(["-r", "/dir1"], terminalSpy);
        expect(fileSystem.exists("/dir1/dir2/file")).toBeFalsy();
        expect(fileSystem.exists("/dir1/dir2")).toBeFalsy();
        expect(fileSystem.exists("/dir1")).toBeFalsy();
        expect(fileSystem.exists("/dir2")).toBeTruthy();
        expect(fileSystem.exists("/file")).toBeTruthy();
    });
});
