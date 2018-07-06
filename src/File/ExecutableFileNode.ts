import IFileNode from "./IFileNode";
import IVoidCallbackFunction from "./IVoidCallbackFunction";

export default class ExecutableFileNode implements IFileNode {
    public isDir: boolean = false;
    public isFile: boolean = true;
    public isExecutable: boolean = true;
    public name: string;

    private callback: IVoidCallbackFunction;

    constructor(name: string, callback: IVoidCallbackFunction) {
        this.name = name;
        this.callback = callback;
    }

    public execute(): void  {
        this.callback();
    }

    public getContents(): IVoidCallbackFunction {
        return this.callback;
    }
}
