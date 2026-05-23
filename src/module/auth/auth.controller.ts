import type { Request, Response } from "express"
import { authService } from "./auth.service"

const signup = async (req: Request, res: Response) => {
    try {
        const result = await authService.signupUserInDB(req.body)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: result
        })
    } catch (error : any) {
        res.status(400).json({
            success: false,
            message: error.message,
            error: error
        })
    }
 }

export const authController = {
    signup
}