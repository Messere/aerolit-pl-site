import IFileSystem from "../FileSystem/IFileSystem";
import IPrompt from "./IPrompt";

export default class PromptWithCwd implements IPrompt {

    private prefix: string;
    private suffix: string;
    private fileSystem: IFileSystem;

    constructor(fileSystem: IFileSystem, prefix: string, suffix: string) {
        this.prefix = prefix;
        this.suffix = suffix;
        this.fileSystem = fileSystem;
    }

    public getPrompt(): string {
        return this.prefix + this.fileSystem.getCwd() + this.suffix;
    }
}
