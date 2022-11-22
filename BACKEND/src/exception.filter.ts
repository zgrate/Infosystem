import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, Logger } from "@nestjs/common";

const logger = new Logger("EXCEPTION HANDLER");

export const handleException = (exception: any) => {
  if (exception instanceof ForbiddenException) {
    logger.warn("Someone tries to use illegal resoure");
  } else {
    logger.error(exception);
    console.trace(exception);
  }
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    this.logger.error(exception);
  }
}
