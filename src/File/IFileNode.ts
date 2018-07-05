export default interface IFileNode {
    isDir: boolean;
    isFile: boolean;
    isExecutable: boolean;
    name: string;
    execute(): void;
    getContents(): any;
}
