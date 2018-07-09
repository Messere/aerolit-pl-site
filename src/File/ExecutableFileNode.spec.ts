import ExecutableFileNode from "./ExecutableFileNode";

describe("Executable file node", () => {
    it("should have proper parameters", () => {
        const file = new ExecutableFileNode("test", () => "");
        expect(file.isDir).toBe(false);
        expect(file.isExecutable).toBe(true);
        expect(file.isFile).toBe(true);
    });

    it("should execute file", () => {
        const spy = jasmine.createSpyObj("spy", ["print"]);
        const file = new ExecutableFileNode("test", () => spy.print("test ok"));
        file.execute();
        expect(spy.print).toHaveBeenCalledWith("test ok");
    });

    it("should return function as content", () => {
        const func = () => "";
        const file = new ExecutableFileNode("test", func);
        expect(file.getContents()).toEqual(func);
    });
});
