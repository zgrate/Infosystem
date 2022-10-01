import { Test, TestingModule } from "@nestjs/testing";
import { ScreenAuthService } from "./screen-auth.service";

describe("ScreenService", () => {
  let service: ScreenAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScreenAuthService]
    }).compile();

    service = module.get<ScreenAuthService>(ScreenAuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
