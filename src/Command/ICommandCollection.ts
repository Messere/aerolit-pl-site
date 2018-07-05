import ICommand from "./ICommand";

export default interface ICommandCollection {
    [propName: string]: ICommand;
}
