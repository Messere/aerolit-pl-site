import InMemoryFileSystem from "../FileSystem/InMemoryFileSystem";
import RmdirCommand from "./RmdirCommand";

describe("Rmdir command", () => {
    let rmdirCommand;
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
        rmdirCommand = new RmdirCommand(fileSystem);
    });

    it("should print help to terminal", () => {
        rmdirCommand.showHelp(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalled();
    });

    it("should display error if called without arguments", () => {
        rmdirCommand.execute([], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "rmdir: missing operand",
        );
    });

    it("should dislpay error if directory does not exist", () => {
        rmdirCommand.execute(["/zonk"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "rmdir: failed to remove '/zonk': No such file or directory",
        );
    });

    it("should display error if given file path", () => {
        rmdirCommand.execute(["/file"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "rmdir: failed to remove '/file': Not a directory",
        );
        expect(fileSystem.exists("/file")).toBeTruthy();
    });

    it("should display error if directory is not empty", () => {
        rmdirCommand.execute(["/dir1/dir2"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "rmdir: failed to remove '/dir1/dir2': Directory not empty",
        );
        expect(fileSystem.exists("/dir1/dir2")).toBeTruthy();
    });

    it("should remove empty directory", () => {
        rmdirCommand.execute(["/dir2"], terminalSpy);
        expect(fileSystem.exists("/dir1")).toBeTruthy();
        expect(fileSystem.exists("/dir1/dir2")).toBeTruthy();
        expect(fileSystem.exists("/dir2")).toBeFalsy();
    });
});
