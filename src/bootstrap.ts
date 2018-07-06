import BuiltInCommands from "./Command/BuiltInCommands";
import CommandLineParser from "./Command/CommandLineParser";
import files from "./files";
import InMemoryFileSystem from "./FileSystem/InMemoryFileSystem";
import PromptWithCwd from "./Prompt/PromptWithCwd";
import SimpleTerminal from "./Terminal/SimpleTerminal";
import Terminal from "./Terminal/Terminal";
import Uptime from "./Uptime/Uptime";

declare const UAParser: any;

const fileSystem = new InMemoryFileSystem(files);

const prompt = new PromptWithCwd(
    fileSystem,
    "aerolit.pl [",
    "]$ ",
);

const uaParser = new UAParser();
const uptime = new Uptime(Date.now());
const commands = new BuiltInCommands(
    fileSystem,
    uaParser,
    uptime,
);
const commandLineParser = new CommandLineParser(
    commands,
    fileSystem,
);

// show terminal on screen
const terminal = new SimpleTerminal(
    prompt,
    commandLineParser,
    new Terminal(),
);

terminal.renderTo(document.getElementById("main"));
terminal.start();
