import { Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  email: string;
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

import { BadRequestError } from "@dtut/common";
import Password from "../services/password";
import { User } from "../models/user";

const getCurrentUser = (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
};

const signUp = async (req: Request, res: Response) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("User with email already exists");
  }

  const user = await User.build(req.body);
  await user.save();

  //jwt
  const userToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_KEY!
  );

  //store jwt token
  req.session = {
    token: userToken,
  };

  res.status(201).send(user);
};

const signOut = (req: Request, res: Response) => {
  req.session = null;
  res.send({});
};

const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError("User does not exist");
  }
  const passwordMatch = await Password.compare(existingUser.password, password);
  if (!passwordMatch) {
    throw new BadRequestError("Invalid credentials!");
  }

  //jwt
  const userToken = jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    process.env.JWT_KEY!
  );

  //store jwt token
  req.session = {
    token: userToken,
  };

  res.status(200).send(existingUser);
};

export default {
  getCurrentUser,
  signUp,
  signOut,
  signIn,
};
