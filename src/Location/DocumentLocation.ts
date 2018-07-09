import ILocation from "./ILocation";

export default class DocumentLocation implements ILocation {
    public getHref(): string {
        return document.location.href;
    }
}
