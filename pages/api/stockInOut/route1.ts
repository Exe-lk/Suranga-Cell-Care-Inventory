import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createstockOut
} from '../../../service/stockInOutDissService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { model, brand,category,quantity,date,dealerName,dealerTelNum,dealerPrecentage,technicianNum,dateIn,cost,sellingPrice,sellerName,stock } = req.body;
        if (!model) {
          res.status(400).json({ error: 'stock In name is required' });
          return;
        }
        const id = await createstockOut(model, brand,category,quantity,date,dealerName,dealerTelNum,dealerPrecentage,technicianNum,dateIn,cost,sellingPrice,sellerName,stock);
        res.status(201).json({ message: 'stock In created', id });
        break;
      }

      
      default: {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred',});
  }
}