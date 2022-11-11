import { applyDecorators, createParamDecorator, ExecutionContext, UseGuards } from "@nestjs/common";
import { User } from "typegram/manage";
import { AdminAuthorization } from "./admin-auth.guard";

export const TGUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const user = ctx?.getArgs()[0]?.update?.user;
    const user2 = ctx?.getArgs()[0]?.update?.message?.from;
    console.log(user);
    console.log(user2);
    return user ? user : user2;
  }
);

export const TGArguments = createParamDecorator(
  (data, ctx: ExecutionContext): string[] => {
    return ctx?.getArgs()[0]?.update?.message?.text?.split(" ")?.slice(1);
    // console.log(user);
    // console.log(user2);
    // return user ? user : user2;
  }
);

export const TGAdminAuth = () => {
  return applyDecorators(UseGuards(AdminAuthorization));
};

// const commands = ctx.message.text.split(" ").slice(1);
