import ICommandCollection from "./ICommandCollection";
import Help from "./Help";
import ICommand from "./ICommand";
import Ls from "./Ls";
import IFileSystem from "../FileSystem/IFileSystem";

export default class BuiltInCommands implements ICommandCollection {
    [propName: string]: ICommand;

    constructor(fileSystem: IFileSystem) {
        this.help = new Help(this);
        this.ls = new Ls(fileSystem);
    }
}
