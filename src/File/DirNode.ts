import IFileNode from "./IFileNode";
import IFileNodeCollection from "./IFileNodeCollection";

export default class DirNode implements IFileNode {
    public isDir: boolean = true;
    public isFile: boolean = false;
    public isExecutable: boolean = false;
    public name: string;

    private children: IFileNodeCollection;

    constructor(name: string, children: IFileNodeCollection) {
        this.name = name;
        this.children = children;
    }

    public execute(): void {
        throw new Error("Not executable");
    }

    public getContents(): object {
        return this.children;
    }

    public isEmpty(): boolean {
        return Object.keys(this.children).length === 0;
    }
}
