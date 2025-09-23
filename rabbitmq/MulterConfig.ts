import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

MulterModule.register({
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // limite 5MB
});
