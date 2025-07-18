// utils/prismaErrorHandler.js
import { Prisma } from "../generated/prisma/index.js";

function handlePrismaError(error, res) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return res.status(409).json({ 
            error: `Unique constraint failed on: ${error.meta?.target?.join(', ')}`,
            code: error.code 
        });

      case 'P2025':
        return res.status(404).json({ error: `Record not found.`, code: error.code  });

      case 'P2003':
        return res.status(400).json({ error: `Foreign key constraint failed.`, code: error.code  });

      default:
        return res.status(500).json({ error: `Database error: ${error.message}` });
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ error: 'Validation error: ' + error.message });
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return res.status(500).json({ error: 'Database initialization error' });
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return res.status(500).json({ error: 'Unexpected Prisma panic error' });
  }

  // Default case
  return res.status(500).json({ error: 'Unexpected server error' });
}

export default handlePrismaError;
