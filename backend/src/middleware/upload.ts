// src/middleware/upload.ts
import multer from 'multer';
import path from 'path';

// Configuração do armazenamento
const storage = multer.memoryStorage();

// Configuração do upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido. Apenas JPEG e PNG são permitidos.'));
    }
  },
});

export default upload;