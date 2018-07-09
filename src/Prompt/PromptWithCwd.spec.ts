import InMemoryFileSystem from "../FileSystem/InMemoryFileSystem";
import PromptWithCwd from "./PromptWithCwd";

describe("Prompt with current directory", () => {
    it("should return prompt with current directory", () => {
        const fileSystem = new InMemoryFileSystem({
            a: {
                b: {
                    c: {

                    },
                },
            },
        });

        const prompt = new PromptWithCwd(fileSystem, "[", "]");

        expect(prompt.getPrompt()).toEqual("[/]");
        fileSystem.setCwd("/a/b");
        expect(prompt.getPrompt()).toEqual("[/a/b]");
        fileSystem.setCwd("..");
        expect(prompt.getPrompt()).toEqual("[/a]");
    });
});
