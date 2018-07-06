import IUptime from "./IUptime";

export default class Uptime implements IUptime {
    private startTime : number;

    constructor(startTime: number) {
        this.startTime = startTime;
    }

    getUptimeInMilliseconds() : number {
        const now = Date.now();
        const milliseconds = now - this.startTime;
        return milliseconds;
    }

    private pad(s: number) {
        return ('00' + s).slice(-2);
    }

    getUptimeAsString() : string {
        const s = this.getUptimeInMilliseconds();
        return this.pad(s/3.6e6|0) + ':' + 
            this.pad((s%3.6e6)/6e4 | 0) + ':' + 
            this.pad((s%6e4)/1000|0);
    }
}
