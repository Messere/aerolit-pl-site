import DirNode from "./DirNode";
import TextFileNode from "./TextFileNode";

describe("Directory node", () => {
    it("should have proper parameters", () => {
        const dir = new DirNode("test", {});
        expect(dir.isDir).toBe(true);
        expect(dir.isExecutable).toBe(false);
        expect(dir.isFile).toBe(false);
    });

    it("should throw exception if executed", () => {
        const dir = new DirNode("test", {});
        expect(() => dir.execute()).toThrowError("Not executable");
    });

    it("should return all children as dir content", () => {
        const children = {
            a: new TextFileNode("a", "a"),
            b: new DirNode("b", {}),
        };
        const dir = new DirNode("test", children);
        expect(dir.getContents()).toBe(children);
    });

    it("should be empty", () => {
        const dir = new DirNode("test", {});
        expect(dir.isEmpty()).toBe(true);
    });

    it("should not be empty", () => {
        const dir = new DirNode("test", {
            a: new TextFileNode("a", "A"),
        });
        expect(dir.isEmpty()).toBe(false);
    });
});
