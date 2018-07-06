import IUptime from "./IUptime";

export default class Uptime implements IUptime {
    private startTime: number;

    constructor(startTime: number) {
        this.startTime = startTime;
    }

    public getUptimeInMilliseconds(): number {
        const now = Date.now();
        const milliseconds = now - this.startTime;
        return milliseconds;
    }

    public getUptimeAsString(): string {
        const s = this.getUptimeInMilliseconds();
        return this.pad(Math.floor(s / 3.6e6)) + ":" +
            this.pad(Math.floor((s % 3.6e6) / 6e4)) + ":" +
            this.pad(Math.floor((s % 6e4) / 1000));
    }

    private pad(s: number) {
        return ("00" + s).slice(-2);
    }
}
