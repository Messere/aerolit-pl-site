class Config {
    public pageUrl = "http://localhost:7203";
    public inputSelector = ".Terminal p:last-child span:first-child";
    public lastPromptSelector = ".Terminal p:first-child div.prompt:last-child";
    public lastOutputSelector = ".Terminal p:first-child div:nth-last-child(2)";
    public allInputLines = ".Terminal p:first-child div";
}

const config = new Config();
export default config;
