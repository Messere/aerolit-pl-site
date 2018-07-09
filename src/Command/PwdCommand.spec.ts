import InMemoryFileSystem from "../FileSystem/InMemoryFileSystem";
import PwdCommand from "./PwdCommand";

describe("Pwd command", () => {
    let pwdCommand;
    let terminalSpy;
    let fileSystem;

    beforeEach(() => {
        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn"]);
        fileSystem = new InMemoryFileSystem({
            dir1: {
                dir2: {
                    file: "test",
                },
            },
        });
        pwdCommand = new PwdCommand(fileSystem);
    });

    it("should print help to terminal", () => {
        pwdCommand.showHelp(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalled();
    });

    it("should show root as current directory", () => {
        pwdCommand.execute([], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("/");
    });

    it("should show current directory", () => {
        fileSystem.setCwd("/dir1");
        pwdCommand.execute([], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("/dir1");
    });

    it("shoild show current directory as last set, even if it has been deleted", () => {
        fileSystem.setCwd("/dir1/dir2");
        fileSystem.remove("/dir1");
        pwdCommand.execute([], terminalSpy);
        expect(fileSystem.exists("/dir1/dir2")).toBeFalsy();
        expect(terminalSpy.printLn).toHaveBeenCalledWith("/dir1/dir2");
    });
});
