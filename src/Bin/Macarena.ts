import ITerminal from "../Terminal/ITerminal";

// -----------------------------------------------------------------------//
//    o      o     o    o     o    <o     <o>    o>    o
//   .|.    \|.   \|/   //    X     \      |    <|    <|>
//    /\     >\   /<    >\   /<     >\    /<     >\   /<
// -----------------------------------------------------------------------//
// original artwork by Mr. Asciihead, posted on alt.ascii-art

export default async function macarena(
    args: string[],
    terminal: ITerminal,
    timeToRun: number = 5400,
) {
    const frames = [
        "Macarena\n" +
            "    o\n" +
            "   .|.\n" +
            "    /\\",

        "acarena \n" +
        "    o\n" +
        "   \\|.\n" +
        "    >\\\n",

        "carena M\n" +
        "    o\n" +
        "   \\|/\n" +
        "   /<\n",

        "arena Ma\n" +
        "    o\n" +
        "    //\n" +
        "    >\\\n",

        "rena Mac\n" +
        "    o\n" +
        "    X\n" +
        "   /<\n",

        "ena Maca\n" +
        "   <o\n" +
        "    \\\n" +
        "    >\\\n",

        "na Macar\n" +
        "   <o>\n" +
        "    |\n" +
        "   /<\n",

        "a Macare\n" +
        "    o>\n" +
        "   <|\n" +
        "    >\\\n",

        " Macaren\n" +
        "    o\n" +
        "   <|>\n" +
        "   /<\n",
    ];

    const timeOut = 200;
    let currentFrame = 0;

    const showFrame = () => {
        terminal.clear();
        terminal.printLn(frames[currentFrame]);
        currentFrame++;
        if (currentFrame >= frames.length) {
            currentFrame = 0;
        }
    };

    const interval = setInterval(showFrame, timeOut);

    await new Promise((resolve) => setTimeout(resolve, timeToRun));
    clearInterval(interval);
}
