import DirNode from "../File/DirNode";
import ExecutableFileNode from "../File/ExecutableFileNode";
import TextFileNode from "../File/TextFileNode";
import InMemoryFileSystem from "./InMemoryFileSystem";

describe("In memory file system", () => {
    let fileSystem;
    const executable = () => "exe";

    beforeEach(() => {
        fileSystem = new InMemoryFileSystem({
            a: {
                b: {
                    c: {
                        d: {

                        },
                    },
                },
            },
            b: {
                file: "test",
            },
            executable,
            file: "test",
        });
    });

    it("should have initial working directory set to '/'", () => {
        expect(fileSystem.getCwd()).toEqual("/");
    });

    it("should set directory by absolute path", () => {
        fileSystem.setCwd("/a/b/c");
        expect(fileSystem.getCwd()).toEqual("/a/b/c");
    });

    it("should set directory by path with special directories .. and .", () => {
        fileSystem.setCwd("/a/b/c");
        fileSystem.setCwd(".././../b");
        expect(fileSystem.getCwd()).toEqual("/a/b");
    });

    it("should set directory by relative path", () => {
        fileSystem.setCwd("/a");
        fileSystem.setCwd("b");
        expect(fileSystem.getCwd()).toEqual("/a/b");
    });

    it("should allow to change directory to root", () => {
        fileSystem.setCwd("/a");
        fileSystem.setCwd("/");
        expect(fileSystem.getCwd()).toEqual("/");
    });

    it("should throw exception in attempt to change directory to file path", () => {
        expect(() => fileSystem.setCwd("/file")).toThrowError("/file is not a directory");
    });

    it("should throw exception in attempt to change directory to non-existent path", () => {
        expect(() => fileSystem.setCwd("/no-dir")).toThrowError("/no-dir does not exist");
    });

    it("should tell that file exists", () => {
        expect(fileSystem.exists("/a")).toBe(true);
        expect(fileSystem.exists("/file")).toBe(true);
        expect(fileSystem.exists("a")).toBe(true);
        expect(fileSystem.exists("/a/./../file")).toBe(true);
    });

    it("should tell that file does not exist", () => {
        expect(fileSystem.exists("/aa")).toBe(false);
        expect(fileSystem.exists("/a/x")).toBe(false);
        expect(fileSystem.exists("/a/../file2")).toBe(false);
    });

    it("should return directory", () => {
        const file = fileSystem.getFile("/b");
        expect(file).toEqual(new DirNode("b", {
            file: new TextFileNode("file", "test"),
        }));
    });

    it("should return text file", () => {
        const file = fileSystem.getFile("/file");
        expect(file).toEqual(new TextFileNode("file", "test"));
    });

    it("should return executable file", () => {
        const file = fileSystem.getFile("/executable");
        expect(file).toEqual(new ExecutableFileNode("executable", executable));
    });

    it("should throw exception in attempt to get non-existent file", () => {
        expect(() => fileSystem.getFile("/zonk")).toThrowError("file does not exist");
    });

    it("should throw exception on unsupported object in filesystem",  () => {
        const brokenFileSystem = new InMemoryFileSystem({
            a: Symbol(),
        });
        expect(() => brokenFileSystem.getFile("/a"))
        .toThrowError("Unsupported object type 'symbol' for 'a' entry in filesystem");
    });

    it("should remove file", () => {
        fileSystem.remove("/file");
        expect(fileSystem.exists("/file")).toBe(false);
    });

    it("should remove directory", () => {
        fileSystem.remove("/a");
        expect(fileSystem.exists("/a")).toBe(false);
        expect(fileSystem.exists("/a/b")).toBe(false);
    });

    it("should throw error when removing non-existent node", () => {
        expect(() => fileSystem.remove("/zonk")).toThrowError("/zonk does not exist");
    });

    it("should throw exception when trying to add file to another file", () => {
        const file = new TextFileNode("test", "test");
        expect(() => fileSystem.add("/file", file)).toThrowError("/file is not a directory");
    });

    it("should throw excpetion if file already exists", () => {
        const file = new TextFileNode("file", "test");
        expect(() => fileSystem.add("/", file)).toThrowError("file already exists under /");
    });

    it("should add file to filesystem", () => {
        const file = new TextFileNode("file", "test");
        fileSystem.add("/a", file);
        expect(fileSystem.exists("/a/file")).toBe(true);
        expect(fileSystem.getFile("/a/file")).toEqual(file);
    });
});
