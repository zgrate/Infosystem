import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as requestIp from "request-ip";
import * as fs from "fs";
import { INestApplication } from "@nestjs/common";

const useHTTPS = true;
const PRIVATE_KEY = "/usr/certificates/privkey.pem";
const PUBLIC_CERT = "/usr/certificates/cert.pem";

async function bootstrap() {
  let httpsOptions = {};
  try {
    httpsOptions = {
      key: fs.readFileSync(PRIVATE_KEY),
      cert: fs.readFileSync(PUBLIC_CERT)
    };
    console.log("USING HTTPS");
  } catch (err) {
    console.log("USING OLD HTTP");
  }
  let app: INestApplication = undefined;
  if (useHTTPS) {
    app = await NestFactory.create(AppModule, httpsOptions);
  } else {
    app = await NestFactory.create(AppModule, {
      abortOnError: false
    });
  }

  app.use(requestIp.mw());
  app.enableCors({ origin: "*" });
  await app.listen(process.env.PORT);
}


bootstrap();
