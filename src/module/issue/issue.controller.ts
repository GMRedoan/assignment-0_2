import type { Request, Response } from "express"
import { issueService } from "./issue.service"

const createIssue = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            throw new Error('User not found')
        }

        const result = await issueService.createIssueIntoDB(req.body, req.user)

        res.status(201).json({
            success: true,
            message: 'Issue Created Successfully',
            data: result,
        })

    } catch (error : any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })

    }
}

const getAllIssues = async (req: Request, res: Response) => {
    try {
        const filters = {
            sort: req.query.sort as string,
            type: req.query.type as string,
            status: req.query.status as string,
        }

    const result = await issueService.getAllIssuesFromDB(filters)

    res.status(200).json({
        success: true,
        data: result,
    })

} catch (error: any) {
    res.status(500).json({
        success: false,
        message: error.message,
        error: error
    })
} }

const getIssueById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const result = await issueService.getIssueByIdFromDB(id as string)

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            })
        }

        res.status(200).json({
            success: true,
            data: result,
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}   

const updateIssueById = async (req: Request, res: Response) =>{
    try {
        if (!req.user) {
            throw new Error('User not found')
        }

        const { id } = req.params
        const result = await issueService.updateIssueByIdInDB(id as string, req.body, req.user)

        res.status(200).json({
            success: true,
            message: 'Issue updated successfully',
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }   
}

export const issueController = {
    getAllIssues,
    getIssueById,
    createIssue,
    updateIssueById
}