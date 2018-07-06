import ICommandCollection from "./ICommandCollection";
import HelpCommand from "./HelpCommand";
import ICommand from "./ICommand";
import LsCommand from "./LsCommand";
import IFileSystem from "../FileSystem/IFileSystem";
import PwdCommand from "./PwdCommand";
import CdCommand from "./CdCommand";
import CatCommand from "./CatCommand";
import FileCommand from "./FileCommand";
import RmCommand from "./RmCommand";
import RmdirCommand from "./RmdirCommand";

export default class BuiltInCommands implements ICommandCollection {
    [propName: string]: ICommand;

    constructor(fileSystem: IFileSystem) {
        this.help = new HelpCommand(this);
        this.ls = new LsCommand(fileSystem);
        this.pwd = new PwdCommand(fileSystem);
        this.cd = new CdCommand(fileSystem);
        this.cat = new CatCommand(fileSystem);
        this.file = new FileCommand(fileSystem);
        this.rm = new RmCommand(fileSystem);
        this.rmdir = new RmdirCommand(fileSystem);
    }
}
