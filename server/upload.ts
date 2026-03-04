import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { randomBytes } from "crypto";

// Configuração do multer para armazenamento temporário na memória
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Verificar se é uma imagem
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos') as any, false);
    }
  }
});

// Função para fazer upload para o Object Storage do Replit
export async function uploadToObjectStorage(buffer: Buffer, filename: string): Promise<string> {
  const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
  const publicDir = '/public/tourist-images';
  
  if (!bucketId) {
    throw new Error('Object storage não configurado');
  }

  // Gerar nome único para o arquivo
  const fileExtension = path.extname(filename);
  const uniqueFilename = `${randomBytes(16).toString('hex')}${fileExtension}`;
  const objectPath = `${publicDir}/${uniqueFilename}`;

  try {
    // Fazer upload usando a API do Object Storage do Replit
    const uploadUrl = `https://objectstorage.replit.com/${bucketId}${objectPath}`;
    
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: buffer,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': buffer.length.toString(),
      },
    });

    if (!response.ok) {
      throw new Error(`Upload falhou: ${response.statusText}`);
    }

    // Retornar URL pública do arquivo
    return `https://objectstorage.replit.com/${bucketId}${objectPath}`;
    
  } catch (error) {
    console.error('Erro no upload:', error);
    throw new Error('Falha no upload para object storage');
  }
}

// Middleware para processar upload
export const uploadMiddleware = upload.single('file');

// Handler para rota de upload
export async function handleFileUpload(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const url = await uploadToObjectStorage(req.file.buffer, req.file.originalname);
    
    res.json({ 
      url,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
    
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    });
  }
}

// Middleware para tratamento de erros do multer
export function handleMulterError(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo muito grande. Tamanho máximo: 10MB' });
    }
    return res.status(400).json({ error: `Erro no upload: ${err.message}` });
  }
  
  if (err.message === 'Apenas arquivos de imagem são permitidos') {
    return res.status(400).json({ error: err.message });
  }
  
  next(err);
}