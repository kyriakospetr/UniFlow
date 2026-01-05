import Server from "./server.js";

class Uniflow {
    private server: Server;

    constructor() {
        this.server = new Server();
    }

    public run():void {
        this.server.start();
    }
}

const uniFlow: Uniflow = new Uniflow();
uniFlow.run()