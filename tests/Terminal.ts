import { Selector } from "testcafe";
import config from "./Helpers/Config";
import { expectContents, expectLastOutput, expectLastOutputNotEquals, runCommand } from "./Helpers/TerminalActions";

fixture("Teminal").page(config.pageUrl);

test("shows prompt when started", async (t: TestController) => {
    expectContents(t, ["aerolit.pl [/test]$ "]);
});

test("can input text into console", async (t: TestController) => {
    const keySequence = "a b c d e f g h 1 2 3";
    await t.pressKey(keySequence);
    await t.expect(
        Selector(config.inputSelector).textContent,
    ).eql(
        keySequence.split(" ").join(""),
    );
});

test("can use backspace to delete characters", async (t: TestController) => {
    await t.pressKey("a b c backspace");
    await t.expect(Selector(config.inputSelector).textContent).eql("ab");
});

test("shows prompt", async (t: TestController) => {
    await t.expect(Selector(config.lastPromptSelector).textContent).eql("aerolit.pl [/]$ ");
});

test("uses enter to accept command and shows another prompt", async (t: TestController) => {
    await runCommand(t, "pwd");
    await expectLastOutput(t, "/");
    await t.expect(Selector(config.inputSelector).textContent).eql("");
    await t.expect(Selector(config.lastPromptSelector).textContent).eql("aerolit.pl [/]$ ");
});

test("shows another prompt when empty command is accepted with enter", async (t: TestController) => {
    await t.pressKey("enter");
    await expectContents(t, [
        "aerolit.pl [/]$ ",
        "aerolit.pl [/]$ ",
    ]);
});

test("shows current directory in prompt", async (t: TestController) => {
    await runCommand(t, "cd /test");
    await t.expect(Selector(config.lastPromptSelector).textContent).eql("aerolit.pl [/test]$ ");
});

test("shows error message on non-existent command", async (t: TestController) => {
    await runCommand(t, "zonk");
    await expectLastOutput(t, "zonk: command not found");
});

test("can be cleared", async (t: TestController) => {
    await runCommand(t, "zonk");
    runCommand(t, "clear");
    expectContents(t, ["aerolit.pl [/test]$ "]);
});

test("can run executable files", async (t: TestController) => {
    await runCommand(t, "/test/file-exec");
    expectLastOutput(t, "lorem ipsum");
});

test("can run built in commands", async (t: TestController) => {
    const commands = "help ls pwd cd cat file rm rmdir uname ps fortune whoami wget".split(" ");
    for (const command of commands) {
        await runCommand(t, command);
        await expectLastOutputNotEquals(t, `${command}: command not found`);
    }
});
