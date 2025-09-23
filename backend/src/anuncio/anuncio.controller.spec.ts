import { Test, TestingModule } from '@nestjs/testing';
import { AnuncioController } from './anuncio.controller';

describe('AnuncioController', () => {
  let controller: AnuncioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnuncioController],
    }).compile();

    controller = module.get<AnuncioController>(AnuncioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
