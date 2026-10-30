import { Request, Response } from 'express';
import { demoStore } from '../services/demoStore.js';

export async function getCommodities(req: Request, res: Response) {
  try {
    const { category, village, maxRate, search } = req.query;
    const commodities = demoStore.getCommodities({
      category: category as string,
      village: village as string,
      maxRate: maxRate ? Number(maxRate) : undefined,
      search: search as string,
    });
    return res.json({ success: true, data: commodities });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function getCommodityById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const commodity = demoStore.getCommodityById(id);
    if (!commodity) {
      return res.status(404).json({ success: false, error: 'Commodity not found' });
    }
    return res.json({ success: true, data: commodity });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function createCommodity(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.title || !data.category || !data.ratePerHour) {
      return res.status(400).json({ success: false, error: 'Missing title, category, or ratePerHour' });
    }
    const commodity = demoStore.createCommodity(data);
    return res.status(201).json({ success: true, data: commodity });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function updateCommodity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updated = demoStore.updateCommodity(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Commodity not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function getRentals(req: Request, res: Response) {
  try {
    const { renterId, ownerId } = req.query;
    const rentals = demoStore.getRentals({
      renterId: renterId as string,
      ownerId: ownerId as string,
    });
    return res.json({ success: true, data: rentals });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function createRental(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.commodityId || !data.durationHours || !data.totalAmount) {
      return res.status(400).json({ success: false, error: 'Incomplete rental booking data' });
    }
    const rental = demoStore.createRental(data);
    return res.status(201).json({ success: true, data: rental });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function updateRentalStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = demoStore.updateRentalStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Rental booking not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
}
