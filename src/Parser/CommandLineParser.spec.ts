import ICommand from "../Command/ICommand";
import InMemoryFileSystem from "../FileSystem/InMemoryFileSystem";
import ITerminal from "../Terminal/ITerminal";
import CommandLineParser from "./CommandLineParser";

describe("Command line parser", () => {
    let commands;
    let fileSystem;
    let parser;
    let terminalSpy;

    beforeEach(() => {
        terminalSpy = jasmine.createSpyObj("ITerminal", ["printLn"]);

        class BuiltIn implements ICommand {
            public execute(args: string[], terminal: ITerminal) {
                terminal.printLn("Builtin with arguments: " + args.join(", "));
            }
            public showHelp(terminal: ITerminal) {
                terminal.printLn("Help!");
            }
        }

        commands = {
            builtin: new BuiltIn(),
        };

        fileSystem = new InMemoryFileSystem({
            "dir": {},
            "file": "test",
            "run.me": (args: string[], terminal: ITerminal) => terminal.printLn(
                "run.me with arguments: " + args.join(", "),
            ),
        });

        parser = new CommandLineParser(commands, fileSystem);
    });

    it("should execute built in command", () => {
        const callable = parser.handle("builtin    a b    c");
        callable(terminalSpy);

        expect(terminalSpy.printLn).toHaveBeenCalledWith("Builtin with arguments: a, b, c");
    });

    it("should execute executable file from file system", () => {
        const callable = parser.handle("/run.me   a   b c");
        callable(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("run.me with arguments: a, b, c");
    });

    it("should not execute text file", () => {
        const callable = parser.handle("/file");
        callable(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("/file: command not found");
    });

    it("should not execute directory", () => {
        const callable = parser.handle("/dir");
        callable(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("/dir: command not found");
    });

    it("should not execute non-existent file", () => {
        const callable = parser.handle("/zonk");
        callable(terminalSpy);
        expect(terminalSpy.printLn).toHaveBeenCalledWith("/zonk: command not found");
    });
});
