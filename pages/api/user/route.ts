import type { NextApiRequest, NextApiResponse } from 'next';
import {
    SignInUser,
    getUserPositionByEmail
} from '../../../service/authentication';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { email, password } = req.body;
        if (!email || !password) {
          res.status(400).json({ error: 'Email and password are required' });
          return;
        }
        const user = await SignInUser(email, password);
        res.status(201).json({ message: 'User created', user });
        break;
      }
      case 'GET': {
        const {email} = req.body;
        if (!email){
          res.status(400).json({ error: 'Email is required' });
          return;
        }
        const user = await getUserPositionByEmail(email);
        res.status(200).json(user);
        break;
      }
      default: {
        res.setHeader('Allow', ['POST','GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred',});
  }
}
