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
import ClearCommand from "./ClearCommand";
import UnameCommand from "./UnameCommand";
import PsCommand from "./PsCommand";
import IUptime from "../Uptime/IUptime";
import FortuneCommand from "./FortuneCommand";
import WhoamiCommand from "./WhoamiCommand";

export default class BuiltInCommands implements ICommandCollection {
    [propName: string]: ICommand;

    constructor(
        fileSystem: IFileSystem,
        uaParser: any,
        uptime: IUptime
    ) {
        this.help = new HelpCommand(this);
        this.ls = new LsCommand(fileSystem);
        this.pwd = new PwdCommand(fileSystem);
        this.cd = new CdCommand(fileSystem);
        this.cat = new CatCommand(fileSystem);
        this.file = new FileCommand(fileSystem);
        this.rm = new RmCommand(fileSystem);
        this.rmdir = new RmdirCommand(fileSystem);
        this.clear = new ClearCommand();
        this.uname = new UnameCommand(uaParser);
        this.ps = new PsCommand(uaParser, uptime);
        this.fortune = new FortuneCommand();
        this.whoami = new WhoamiCommand();
    }
}
