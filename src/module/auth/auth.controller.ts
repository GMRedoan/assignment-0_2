import type { Request, Response } from "express"
import { authService } from "./auth.service"

const signup = async (req: Request, res: Response) => {
    try {
        const result = await authService.signupUserInDB(req.body)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result
        })
    } catch (error : any) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
 }

 const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUserInDB(req.body)

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        })
    } catch (error : any) {
        res.status(401).json({
            success: false,
            message: error.message,
        })
    }
 }

export const authController = {
    signup,
    login
}