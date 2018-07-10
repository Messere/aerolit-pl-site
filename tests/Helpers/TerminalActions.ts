import { Selector } from "testcafe";
import config from "./Config";

const runCommand = async (t: TestController, command: string) => {
    let keys = command.split("");

    keys = keys.map((key) => {
        return key === " " ? "space" : key;
    });

    const keySequence = keys.join(" ") + " enter";
    return t.pressKey(keySequence);
};

const expectLastOutput = async (t: TestController, output: string) =>
    t.expect(Selector(config.lastOutputSelector).textContent).eql(output);

const expectLastOutputNotEquals = async (t: TestController, output: string) =>
    t.expect(Selector(config.lastOutputSelector).textContent).notEql(output);

const expectContents = async (t: TestController, contents: string[]) => {
    const allLines = Selector(config.allInputLines);
    const lineCount = await allLines.count;

    let nonEmptyLinesCount = 0;
    for (let lineNumber = 0; lineNumber < lineCount; lineNumber++) {
        const text = await allLines.nth(lineNumber).textContent;
        if (text !== "") {
            await t.expect(text).eql(contents[nonEmptyLinesCount]);
            nonEmptyLinesCount++;
        }
    }
    await t.expect(nonEmptyLinesCount).eql(contents.length);
};

export {runCommand, expectLastOutput, expectLastOutputNotEquals, expectContents};
