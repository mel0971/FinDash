import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
// @ts-ignore
import authMiddleware from "../middleware/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// GET - Récupérer tous les holdings d'un portfolio
router.get("/:portfolioId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { portfolioId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId }
    });

    if (!portfolio || portfolio.userId !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const holdings = await prisma.holding.findMany({
      where: { portfolioId }
    });

    res.json(holdings);
  } catch (error: any) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// POST - Créer un nouveau holding
router.post("/:portfolioId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { portfolioId } = req.params;
    const { symbol, type, quantity, averagePrice } = req.body;

    console.log('📥 Reçu du frontend:', { symbol, type, quantity, averagePrice });

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    if (!portfolioId || !symbol || !type || !quantity || !averagePrice) {
      console.log('❌ Données manquantes:', { portfolioId, symbol, type, quantity, averagePrice });
      return res.status(400).json({ message: "Données manquantes" });
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId }
    });

    if (!portfolio || portfolio.userId !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const holding = await prisma.holding.create({
      data: {
        symbol: symbol.toUpperCase(),
        assetType: type,
        quantity: parseFloat(quantity),
        averagePrice: parseFloat(averagePrice),
        portfolioId,
      },
    });

    res.status(201).json(holding);
  } catch (error: any) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});


// PUT - Modifier un holding
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;
    const { symbol, type, quantity, averagePrice } = req.body;  // ← Changez assetType en type


    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }


    if (!symbol || !type || !quantity || !averagePrice) {  // ← Vérifiez type au lieu de assetType
      return res.status(400).json({ message: "Données manquantes" });
    }


    const holding = await prisma.holding.findUnique({
      where: { id }
    });


    if (!holding) {
      return res.status(404).json({ message: "Holding non trouvé" });
    }


    const portfolio = await prisma.portfolio.findUnique({
      where: { id: holding.portfolioId }
    });


    if (!portfolio || portfolio.userId !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }


    const updated = await prisma.holding.update({
      where: { id },
      data: {
        symbol: symbol.toUpperCase(),
        assetType: type,  // ← Mappez type vers assetType
        quantity: parseFloat(quantity),
        averagePrice: parseFloat(averagePrice),
      },
    });


    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});


// DELETE - Supprimer un holding
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const holding = await prisma.holding.findUnique({
      where: { id }
    });

    if (!holding) {
      return res.status(404).json({ message: "Holding non trouvé" });
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: holding.portfolioId }
    });

    if (!portfolio || portfolio.userId !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await prisma.holding.delete({
      where: { id }
    });

    res.json({ message: "Holding supprimé" });
  } catch (error: any) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

export default router;
