import DirNode from "../File/DirNode";
import ExecutableFileNode from "../File/ExecutableFileNode";
import IFileNode from "../File/IFileNode";
import IFileNodeCollection from "../File/IFileNodeCollection";
import TextFileNode from "../File/TextFileNode";
import IFileSystem from "./IFileSystem";

export default class InMemoryFileSystem implements IFileSystem {

    public readonly directorySeparator: string = "/";
    private directories: object;
    private currentWorkingDirectory: string[];

    constructor(initalDirectoryStructure: object = {}) {
        this.directories = initalDirectoryStructure;
        this.currentWorkingDirectory = [];
    }

    public getCwd(): string {
        return this.directorySeparator
            + this.currentWorkingDirectory.join(this.directorySeparator);
    }

    public setCwd(path: string): void {
        const canonicalPath = this.getCanonicalPath(path);
        if (this.canonicalPathExists(canonicalPath)) {
            const file = this.getFileByCanonicalPath(canonicalPath);
            if (file.isDir) {
                this.currentWorkingDirectory = canonicalPath;
            } else {
                throw Error(`${path} is not a directory`);
            }
        } else {
            throw Error(`${path} does not exist`);
        }
    }

    public exists(path: string): boolean {
        const canonicalPath = this.getCanonicalPath(path);
        return this.canonicalPathExists(canonicalPath);
    }

    public getFile(path: string): IFileNode {
        const canonicalPath = this.getCanonicalPath(path);
        return this.getFileByCanonicalPath(canonicalPath);
    }

    public remove(path: string): void {
        const canonicalPath = this.getCanonicalPath(path);
        if (this.canonicalPathExists(canonicalPath)) {
            let partialFileSystem = this.directories;
            let lastChunk = null;
            for (
                let chunkPosition = 0;
                chunkPosition < canonicalPath.length;
                chunkPosition++
            ) {
                lastChunk = canonicalPath[chunkPosition];
                if (chunkPosition < canonicalPath.length - 1) {
                    partialFileSystem = partialFileSystem[lastChunk];
                }
            }
            delete partialFileSystem[lastChunk];
        } else {
            throw new Error(`${path} does not exist`);
        }
    }

    public add(path: string, file: IFileNode): void {
        const canonicalPath = this.getCanonicalPath(path);
        const fileNode = this.getFileByCanonicalPath(canonicalPath);

        if (!fileNode.isDir) {
            throw new Error(`${path} is not a directory`);
        }
        if (this.canonicalPathExists([...canonicalPath, file.name])) {
            throw new Error(`${file.name} already exists under ${path}`);
        }

        let partialFileSystem = this.directories;
        for (const chunk of canonicalPath) {
            partialFileSystem = partialFileSystem[chunk];
        }
        partialFileSystem[file.name] = file.getContents();
    }

    private canonicalPathExists(canonicalPath: string[]): boolean {
        let partialFileSystem = this.directories;
        for (const chunk of canonicalPath) {
            partialFileSystem = partialFileSystem[chunk] || null;
            if (partialFileSystem === null) {
                return false;
            }
        }
        return true;
    }

    private getFileByCanonicalPath(canonicalPath: string[]): IFileNode {
        let partialFileSystem = this.directories;
        let lastChunk = null;
        for (
            let chunkPosition = 0;
            chunkPosition < canonicalPath.length;
            chunkPosition++
        ) {
            lastChunk = canonicalPath[chunkPosition];
            if (chunkPosition < canonicalPath.length - 1) {
                partialFileSystem = partialFileSystem[lastChunk];
            }
        }

        return this.getFileNodeFromFileSystem(
            lastChunk,
            partialFileSystem[lastChunk],
        );
    }

    private getFileNodeFromFileSystem(name: string, fileData: any): IFileNode {

        if (name === null) {
            name = this.directorySeparator;
            fileData = this.directories;
        }

        switch (typeof fileData) {
            case "object":
                return new DirNode(
                    name,
                    this.getDirectoryChildren(fileData),
                );
            case "function":
                return new ExecutableFileNode(name, fileData);
            case "string":
                return new TextFileNode(name, fileData);
        }

        throw new Error(`Unsupported object ${name} -> ${typeof fileData} in filesystem`);
    }

    private getDirectoryChildren(fileSystem: object): IFileNodeCollection {
        const children = {};

        for (const child of Object.keys(fileSystem)) {
            children[child] = this.getFileNodeFromFileSystem(
                child,
                fileSystem[child],
            );
        }

        return children;
    }

    private getCanonicalPath(path: string): string[] {

        if (path === null) {
            path =  this.getCwd();
        }

        let canonicalPath = [];
        if (path[0] !== this.directorySeparator) {
            canonicalPath = [...this.currentWorkingDirectory];
        }

        const chunks = path.split(this.directorySeparator);
        for (const chunk of chunks) {
            switch (chunk) {
                case "":
                case ".":
                    continue;
                case "..":
                    canonicalPath.pop();
                    break;
                default:
                    canonicalPath.push(chunk);
                    break;
            }
        }

        return canonicalPath;
    }
}
