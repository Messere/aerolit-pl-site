import TextFileNode from "./TextFileNode";

describe("Executable file node", () => {
    it("should have proper parameters", () => {
        const file = new TextFileNode("test", "");
        expect(file.isDir).toBe(false);
        expect(file.isExecutable).toBe(false);
        expect(file.isFile).toBe(true);
    });

    it("should throw exception if executed", () => {
        const dir = new TextFileNode("test", "");
        expect(() => dir.execute()).toThrowError("Not executable");
    });

    it("should return content", () => {
        const content = "slack wyrm";
        const file = new TextFileNode("test", content);
        expect(file.getContents()).toEqual(content);
    });
});
