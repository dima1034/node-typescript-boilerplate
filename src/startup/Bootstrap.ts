import * as http from 'http';
import * as express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Server } from './Server';
import { exceptionHandler } from './api/exceptionHandler';
import { extendExpressResponse } from './api/extendExpressResponse';

export class Bootstrap {

	public defineExpressApp(app: express.Application): express.Application {
        app.set('host', process.env.APP_HOST);
        app.set('port', Server.normalizePort(process.env.PORT || process.env.APP_PORT || '3000'));
        return app;
    }

	//set monitors here
	public startServer(app: express.Application): http.Server {
		return app.listen(app.get('port'));
	}

	public setupInversifyExpressServer(app: express.Application, ioc: IoC): InversifyExpressServer {
        const inversifyExpressServer = new InversifyExpressServer(ioc.container, undefined, {
            rootPath: process.env.APP_URL_PREFIX
        }, app);
        // @ts-ignore: False type definitions from express
        inversifyExpressServer.setConfig((a) => a.use(extendExpressResponse));
        // @ts-ignore: False type definitions from express
        inversifyExpressServer.setErrorConfig((a) => a.use(exceptionHandler));
        return inversifyExpressServer;
    }

    public bindInversifyExpressServer(app: express.Application, inversifyExpressServer: InversifyExpressServer): express.Application {
        try {
            app = inversifyExpressServer.build();
        } catch (e) {
            this.log.error(e.message);
            process.exit(1);
        }
        return app;
    }
}
