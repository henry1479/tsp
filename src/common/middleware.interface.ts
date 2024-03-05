import { Request, Response, NextFunction } from "express";

// интерфейс по мидлвэрам общий
export interface IMiddleware {
	execute: (req: Request, res: Response, next: NextFunction) => void;
}
