// src/middleware/upload.ts
import multer from 'multer';

// Configuração do multer para armazenar em memória
const storage = multer.memoryStorage();

// Configuração do multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Verificar o tipo do arquivo
    if (!file.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
      return cb(new Error('Apenas imagens JPEG e PNG são permitidas'));
    }
    cb(null, true);
  },
});

export default upload;