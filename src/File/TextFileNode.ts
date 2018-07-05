import IFileNode from "./IFileNode";

export default class TextFileNode implements IFileNode {
    isDir: boolean = false;
    isFile: boolean = true;
    isExecutable: boolean = false;
    name: string;
    contents: string;    

    constructor(name: string, contents: string) {
        this.name = name;
        this.contents = contents;
    }

    execute() : void  {
        throw new Error('Not executable');
    }

    getContents(): string {
        return this.contents;
    }
}
