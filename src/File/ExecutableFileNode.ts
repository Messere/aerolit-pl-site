import IVoidCallbackFunction from './IVoidCallbackFunction';
import IFileNode from "./IFileNode";

export default class ExecutableFileNode implements IFileNode {
    isDir: boolean = false;
    isFile: boolean = true;
    isExecutable: boolean = true;
    name: string;
    
    private callback: IVoidCallbackFunction;

    constructor(name: string, callback: IVoidCallbackFunction) {
        this.name = name;
        this.callback = callback;
    }

    execute() : void  {
        this.callback();
    }

    getContents(): IVoidCallbackFunction {
        return this.callback;
    }
}
