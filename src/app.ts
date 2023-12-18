import { AppRoutes } from "./application/routes";
import { Server } from "./application/server";
import { envs } from "./config/env";


(async() => {
    main();
})();

function main() {
    
    const server = new Server({
        port: envs.PORT,
        public_path: envs.PUBLIC_PATH,
        routes: AppRoutes.routes,
    });

    server.start();
}