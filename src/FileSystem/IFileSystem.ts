import IFileNode from "../File/IFileNode";

export default interface IFileSystem {
    readonly directorySeparator: string;

    /**
     * get current working directory
     */
    getCwd(): string;

    /**
     * set current working directory to path
     * @param path
     */
    setCwd(path: string): void;

    /**
     * get file (or directory) under path
     */
    getFile(path: string): IFileNode;

    /**
     * check if specified path exists in file system
     * @param path path to check
     */
    exists(path: string): boolean;

    /**
     * remove path from filesystem
     * @param path path to remove
     */
    remove(path: string): void;

    /**
     * add file to filesystem
     * @param path where to add new file
     * @param file new file / directory
     */
    add(path: string, file: IFileNode): void;
}
