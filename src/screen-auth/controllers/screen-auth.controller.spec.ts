import { Test, TestingModule } from "@nestjs/testing";
import { ScreenAuthController } from "./screen-auth.controller";

describe("ScreenController", () => {
  let controller: ScreenAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScreenAuthController]
    }).compile();

    controller = module.get<ScreenAuthController>(ScreenAuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
