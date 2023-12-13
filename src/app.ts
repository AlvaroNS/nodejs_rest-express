import { Server } from "./application/server";
import { envs } from "./config/env";


(() => {
    main();
})();

function main() {
    
    const server = new Server({
        port: envs.PORT,
        public_path: envs.PUBLIC_PATH,
    });

    server.start();
}