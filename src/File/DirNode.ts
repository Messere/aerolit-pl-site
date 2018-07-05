import IFileNode from "./IFileNode";
import IFileNodeCollection from "./IFileNodeCollection";

export default class DirNode implements IFileNode {
    isDir: boolean = true;
    isFile: boolean = false;
    isExecutable: boolean = false;
    name: string;
    
    private children: IFileNodeCollection;

    constructor(name: string, children: IFileNodeCollection) {
        this.name = name;
        this.children = children;
    }

    execute() : void {
        throw new Error('Not executable');
    }

    getContents(): Object {
        return this.children;
    }
}
