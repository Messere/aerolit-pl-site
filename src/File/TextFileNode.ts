import IFileNode from "./IFileNode";

export default class TextFileNode implements IFileNode {
    public isDir: boolean = false;
    public isFile: boolean = true;
    public isExecutable: boolean = false;
    public name: string;
    public contents: string;

    constructor(name: string, contents: string) {
        this.name = name;
        this.contents = contents;
    }

    public execute(): void  {
        throw new Error("Not executable");
    }

    public getContents(): string {
        return this.contents;
    }
}
