import Uptime from "./Uptime";

describe("Uptime", () => {
    let uptime;

    beforeEach(() => {
        jasmine.clock().install();
        jasmine.clock().mockDate();
        uptime = new Uptime(Date.now());
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it("should return how much time passed since initialization", () => {
        jasmine.clock().tick(10000);
        expect(uptime.getUptimeInMilliseconds()).toEqual(10000);
    });

    it("should return readable representation of how much time passed", () => {
        jasmine.clock().tick(10000);
        expect(uptime.getUptimeAsString()).toEqual("00:00:10");
        jasmine.clock().tick(1000000000);
        expect(uptime.getUptimeAsString()).toEqual("77:46:50");
    });
});
