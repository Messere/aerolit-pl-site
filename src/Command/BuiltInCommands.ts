import IFileSystem from "../FileSystem/IFileSystem";
import ILocation from "../Location/ILocation";
import IUptime from "../Uptime/IUptime";
import CatCommand from "./CatCommand";
import CdCommand from "./CdCommand";
import ClearCommand from "./ClearCommand";
import FileCommand from "./FileCommand";
import FortuneCommand from "./FortuneCommand";
import HelpCommand from "./HelpCommand";
import ICommand from "./ICommand";
import ICommandCollection from "./ICommandCollection";
import LsCommand from "./LsCommand";
import PsCommand from "./PsCommand";
import PwdCommand from "./PwdCommand";
import RmCommand from "./RmCommand";
import RmdirCommand from "./RmdirCommand";
import UnameCommand from "./UnameCommand";
import WgetCommand from "./WgetCommand";
import WhoamiCommand from "./WhoamiCommand";

export default class BuiltInCommands implements ICommandCollection {
    [propName: string]: ICommand;

    constructor(
        fileSystem: IFileSystem,
        uaParser: any,
        uptime: IUptime,
        location: ILocation,
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
        this.ps = new PsCommand(uaParser, uptime, location);
        this.fortune = new FortuneCommand();
        this.whoami = new WhoamiCommand();
        this.wget = new WgetCommand(fileSystem);
    }
}
