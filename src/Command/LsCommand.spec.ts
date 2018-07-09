import InMemoryFileSystem from "../FileSystem/InMemoryFileSystem";
import LsCommand from "./LsCommand";

describe("Ls command", () => {
    let lsCommand;
    let terminalSpy;
    let fileSystem;

    beforeEach(() => {
        fileSystem = new InMemoryFileSystem({
            "dir": {
                "executable.js": () => "",
                "file2.txt": "content",
                "subdir": {
                    "subfile.txt": "content",
                },
            },
            "dir2": {
                dir3: {
                    someFile: "irrelevant",
                },
            },
            "file.txt": "content",
        });
        lsCommand = new LsCommand(fileSystem);
        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn"]);
    });

    it("should print help to terminal", () => {
        lsCommand.showHelp(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalled();
    });

    it("should display error if file does not exist", () => {
        lsCommand.execute(["/dir/zonk.txt"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "ls: cannot access '/dir/zonk.txt': No such file or directory",
        );
    });

    it("should display name of the file is called with file path", () => {
        lsCommand.execute(["/file.txt"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "file.txt",
            "",
        );
    });

    it("should display all files contained in a directory", () => {
        lsCommand.execute(["./dir"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "executable.js",
            "file-executable",
        );
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "file2.txt",
            "",
        );
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "subdir",
            "file-dir",
        );
    });

    it("should display proper error if listing current working directory that has been removed", () => {
        fileSystem.setCwd("/dir2/dir3");
        fileSystem.remove("/dir2");
        lsCommand.execute([""], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "ls: cannot access '/dir2/dir3': No such file or directory",
        );
    });
});
