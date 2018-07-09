import CatCommand from "../Command/CatCommand";
import CdCommand from "../Command/CdCommand";
import ClearCommand from "../Command/ClearCommand";
import FileCommand from "../Command/FileCommand";
import FortuneCommand from "../Command/FortuneCommand";
import HelpCommand from "../Command/HelpCommand";
import ICommand from "../Command/ICommand";
import ICommandCollection from "../Command/ICommandCollection";
import LsCommand from "../Command/LsCommand";
import PsCommand from "../Command/PsCommand";
import PwdCommand from "../Command/PwdCommand";
import RmCommand from "../Command/RmCommand";
import RmdirCommand from "../Command/RmdirCommand";
import UnameCommand from "../Command/UnameCommand";
import WgetCommand from "../Command/WgetCommand";
import WhoamiCommand from "../Command/WhoamiCommand";
import IFileSystem from "../FileSystem/IFileSystem";
import ILocation from "../Location/ILocation";
import IUptime from "../Uptime/IUptime";

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
