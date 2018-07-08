import InMemoryFileSystem from "../FileSystem/InMemoryFileSystem";
import FileCommand from "./FileCommand";

describe("File command", () => {
    let fileCommand;
    let terminalSpy;
    let fileSystem;

    beforeEach(() => {
        fileSystem = new InMemoryFileSystem({
            dir: {
                executable: () => null,
                text: "foo",
            },
        });
        fileCommand = new FileCommand(fileSystem);
        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn"]);
    });

    it("should print help to terminal", () => {
        fileCommand.showHelp(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalled();
    });

    it("should display error when called without arguments", () => {
        fileCommand.execute([], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "file: missing operand",
        );
    });

    it("should display error for non-existant file", () => {
        fileCommand.execute(["/zonk"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            "/zonk: cannot open `/zonk' (No such file or directory)",
        );
    });

    it("should tell that file is a directory", () => {
        fileCommand.execute(["/"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            `/: directory`,
        );

        fileCommand.execute(["/dir"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            `/dir: directory`,
        );
    });

    it("should tell that file is a text file", () => {
        fileCommand.execute(["/dir/text"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            `/dir/text: text file`,
        );
    });

    it("should tell that file is an executable", () => {
        fileCommand.execute(["/dir/executable"], terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith(
            `/dir/executable: ECMAScript executable`,
        );
    });
});
