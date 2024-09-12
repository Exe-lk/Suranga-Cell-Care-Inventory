import type { NextApiRequest, NextApiResponse } from 'next';
import {
    createUser,
    getUser
} from '../../../service/userManagementService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { name,role,nic,email,mobile } = req.body;
        if (!name) {
          res.status(400).json({ error: 'Name is required' });
          return;
        }
        const id = await createUser(name,role,nic,email,mobile);
        res.status(201).json({ message: 'User created', id });
        break;
      }
      case 'GET': {
        const users = await getUser();
        res.status(200).json(users);
        break;
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred',});
  }
}
