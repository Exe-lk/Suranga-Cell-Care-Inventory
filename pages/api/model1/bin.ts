// pages/api/category.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createModel,
  getDeleteModel,
  updateModel,
  deleteModel,
} from '../../../service/Model1Service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { name,description } = req.body;
        if (!name) {
          res.status(400).json({ error: 'Model name is required' });
          return;
        }
        const id = await createModel(name,description);
        res.status(201).json({ message: 'Model created', id });
        break;
      }

      case 'GET': {
        const models = await getDeleteModel();
        res.status(200).json(models);
        break;
      }

      case 'PUT': {
        const { id,name,description ,status } = req.body;
        if (!id || !name) {
          res.status(400).json({ error: 'Model ID and name are required' });
          return;
        }
        await updateModel(id, name,description,status);
        res.status(200).json({ message: 'Model updated' });
        break;
      }

      case 'DELETE': {
        const { id } = req.body;
        if (!id) {
          res.status(400).json({ error: 'Model ID is required' });
          return;
        }
        await deleteModel(id);
        res.status(200).json({ message: 'Model deleted' });
        break;
      }

      default: {
        res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred',});
  }
}