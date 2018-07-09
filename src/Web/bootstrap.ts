import {UAParser} from "ua-parser-js";
import BuiltInCommands from "../Command/BuiltInCommands";
import CommandLineParser from "../Command/CommandLineParser";
import InMemoryFileSystem from "../FileSystem/InMemoryFileSystem";
import DocumentLocation from "../Location/DocumentLocation";
import PromptWithCwd from "../Prompt/PromptWithCwd";
import SimpleTerminal from "../Terminal/SimpleTerminal";
import Terminal from "../Terminal/Terminal";
import Uptime from "../Uptime/Uptime";
import files from "./files";

const fileSystem = new InMemoryFileSystem(files);

const prompt = new PromptWithCwd(
    fileSystem,
    "aerolit.pl [",
    "]$ ",
);

const uaParser = new UAParser();
const uptime = new Uptime(Date.now());
const location = new DocumentLocation();
const commands = new BuiltInCommands(
    fileSystem,
    uaParser,
    uptime,
    location,
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

document.getElementById("main").innerHTML = "";
terminal.renderTo(document.getElementById("main"));

terminal.start();
