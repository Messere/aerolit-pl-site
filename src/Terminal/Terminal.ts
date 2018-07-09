import ICommandHandler from "./ICommandHandler";

export default class Terminal {

    public container: HTMLElement;
    private innerWindow: HTMLElement;
    private output: HTMLElement;
    private inputLine: HTMLElement;
    private cursor: HTMLElement;
    private inputElement: HTMLElement;

    private firstPrompt = true;

    constructor() {
        this.container = document.createElement("div");
        this.container.className = "Terminal";

        this.innerWindow = document.createElement("div");
        this.output = document.createElement("p");
        // the span element where the users input is put
        this.inputLine = document.createElement("span");
        this.cursor = document.createElement("span");
        // the full element administering the user input, including cursor
        this.inputElement = document.createElement("p");

        this.inputElement.appendChild(this.inputLine);
        this.inputElement.appendChild(this.cursor);
        this.innerWindow.appendChild(this.output);
        this.innerWindow.appendChild(this.inputElement);
        this.container.appendChild(this.innerWindow);

        this.setBackgroundColor("black");
        this.setTextColor("white");
        this.setTextSize("1em");
        this.setWidth("100%");
        this.setHeight("100%");

        this.container.style.fontFamily = "Monaco, Courier";
        this.container.style.margin = "0";
        this.innerWindow.style.padding = "10px";
        this.inputElement.style.margin = "0";
        this.output.style.margin = "0";
        this.output.style.display = "inline";
        this.cursor.style.background = "white";
        this.cursor.innerHTML = "C"; // put something in the cursor..
        this.cursor.style.display = "none"; // then hide it
        this.inputElement.style.display = "none";
    }

    public print(message: string, className?: string) {
        const newLine = this.makeNewLine(message, className);
        newLine.style.display = "inline";
        this.output.appendChild(newLine);
    }

    public printLn(message: string, className?: string) {
        const newLine = this.makeNewLine(message, className);
        this.output.appendChild(newLine);
    }

    public input(message: string, callback: ICommandHandler) {
        const inputField = document.createElement("input");
        inputField.style.position = "absolute";
        inputField.style.zIndex = "-100";
        inputField.style.outline = "none";
        inputField.style.border = "none";
        inputField.style.opacity = "0";
        inputField.style.fontSize = "0.2em";

        this.inputLine.textContent = "";
        this.inputElement.style.display = "inline-block";
        this.container.appendChild(inputField);

        this.fireCursorInterval(inputField);

        if (message.length) {
            this.print(message, "prompt");
        }

        inputField.onblur = () => {
            this.cursor.style.display = "none";
        };

        inputField.onfocus = () => {
            inputField.value = this.inputLine.textContent;
            this.cursor.style.display = "inline";
        };

        this.container.onclick = () => {
            inputField.focus();
        };

        inputField.onkeydown = (e) => {
            if (e.which === 37 || e.which === 39 || e.which === 38 || e.which === 40 || e.which === 9) {
                e.preventDefault();
            } else if (e.which !== 13) {
                setTimeout(()  => {
                    this.inputLine.textContent = inputField.value;
                }, 1);
            }
        };

        inputField.onkeyup = (e) => {
            if (e.which === 13) {
                this.inputElement.style.display = "none";
                const inputValue = inputField.value;
                this.print(inputValue);
                this.container.removeChild(inputField);
                if (typeof(callback) === "function") {
                    callback(inputValue);
                }
            }
        };

        if (this.firstPrompt) {
            this.firstPrompt = false;
            setTimeout(() => {
                inputField.focus();
            }, 50);
        } else {
            inputField.focus();
        }
    }

    public clear() {
        this.output.innerHTML = "";
    }

    public setTextSize(size: string) {
        this.output.style.fontSize = size;
        this.inputElement.style.fontSize = size;
    }

    public setTextColor(col: string) {
        this.container.style.color = col;
        this.cursor.style.background = col;
    }

    public setBackgroundColor(col: string) {
        this.container.style.background = col;
    }

    public setWidth(width: string) {
        this.container.style.width = width;
    }

    public setHeight(height: string) {
        this.container.style.height = height;
    }

    private makeNewLine(message: string, className?: string) {
        const newLine = document.createElement("div");
        if (className) {
            newLine.className = className;
        }
        newLine.textContent = message;
        return newLine;
    }

    private fireCursorInterval(inputField: HTMLElement) {
        setInterval(() => {
            if (inputField.parentElement) {
                this.cursor.style.visibility =
                    this.cursor.style.visibility === "visible"
                    ? "hidden"
                    : "visible";
            }
        }, 500);
    }
}
