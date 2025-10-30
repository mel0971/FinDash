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

// GET - Récupérer tous les portefeuilles de l'utilisateur AVEC STATS
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const portfolios = await prisma.portfolio.findMany({
      where: { userId },
      include: {
        holdings: true,
      },
    });

    // ✅ FIXE : Calculer les stats pour chaque portefeuille
    const portfoliosWithStats = portfolios.map((portfolio) => {
      // Valeur ACTUELLE du portefeuille
      const currentValue = portfolio.holdings.reduce(
        (sum, h) => sum + h.quantity * h.averagePrice,
        0
      );

      // Valeur INVESTIE (prix d'achat)
      const investedValue = portfolio.holdings.reduce(
        (sum, h) => sum + h.quantity * h.averagePrice,
        0
      );

      // ✅ P&L = Valeur actuelle - Valeur investie
      // MAIS en attendant l'API, on utilise currentPrice = averagePrice
      // Donc le P&L sera 0 jusqu'à l'intégration API
      const pnl = currentValue - investedValue; // = 0 pour l'instant
      const pnlPercent = investedValue > 0 ? (pnl / investedValue) * 100 : 0;

      return {
        ...portfolio,
        totalValue: currentValue,
        pnl,
        pnlPercent,
      };
    });

    res.json(portfoliosWithStats);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
});

// POST - Créer un nouveau portefeuille
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { name } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    if (!name) {
      return res
        .status(400)
        .json({ message: "Le nom du portefeuille est requis" });
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        name,
        userId,
      },
    });

    res.status(201).json(portfolio);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
});

// GET - Récupérer un portefeuille spécifique
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: {
        holdings: true,
      },
    });

    if (!portfolio || portfolio.userId !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    // ✅ Calculer les stats
    const currentValue = portfolio.holdings.reduce(
      (sum, h) => sum + h.quantity * h.averagePrice,
      0
    );
    const investedValue = portfolio.holdings.reduce(
      (sum, h) => sum + h.quantity * h.averagePrice,
      0
    );
    const pnl = currentValue - investedValue;
    const pnlPercent = investedValue > 0 ? (pnl / investedValue) * 100 : 0;

    res.json({
      ...portfolio,
      totalValue: currentValue,
      pnl,
      pnlPercent,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
});

// DELETE - Supprimer un portefeuille
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio || portfolio.userId !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await prisma.portfolio.delete({
      where: { id },
    });

    res.json({ message: "Portefeuille supprimé" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
});

// PUT - Mettre à jour un portefeuille
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;
    const { name } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    if (!name) {
      return res.status(400).json({ message: "Le nom est requis" });
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio || portfolio.userId !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id },
      data: { name },
      include: { holdings: true },
    });

    const currentValue = updatedPortfolio.holdings.reduce(
      (sum, h) => sum + h.quantity * h.averagePrice,
      0
    );
    const investedValue = updatedPortfolio.holdings.reduce(
      (sum, h) => sum + h.quantity * h.averagePrice,
      0
    );
    const pnl = currentValue - investedValue;
    const pnlPercent = investedValue > 0 ? (pnl / investedValue) * 100 : 0;

    res.json({
      ...updatedPortfolio,
      totalValue: currentValue,
      pnl,
      pnlPercent,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
});

export default router;
