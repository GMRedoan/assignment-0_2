import { pool } from "../../db"
import type { TAuthUser, TIssuePayload } from "./issue.interface"

const createIssueIntoDB = async (payload: TIssuePayload, userPayload: TAuthUser) => {
    const { title, description, type } = payload;
    const { id } = userPayload;

    if (!title || !description || !type) {
        throw new Error("Missing required fields");
    }

    const userResult = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
    
    const validUser = userResult.rows[0];
    if (!validUser) {
        throw new Error("User Not Valid");
    }

    const issueResult = await pool.query(
        `
    INSERT INTO issues(
      title, description, type, reporter_id
    ) VALUES($1, $2, $3, $4)
    RETURNING *
    `,
        [title, description, type, validUser.id],
    );

    return issueResult.rows[0];
};

const getAllIssuesFromDB = async (filters?: {
    sort?: string
    type?: string
    status?: string
}) => {
    const { sort = "newest", type, status } = filters || {}

    let query = `
    SELECT
      issues.id,
      issues.title,
      issues.description,
      issues.type,
      issues.status,
      issues.created_at,
      issues.updated_at,

      users.id AS reporter_id,
      users.name AS reporter_name,
      users.role AS reporter_role

    FROM issues
    JOIN users ON issues.reporter_id = users.id
  `

    const conditions: string[] = []
    const values: string[] = []

    if (type) {
        values.push(type)
        conditions.push(`issues.type = $${values.length}`)
    }

    if (status) {
        values.push(status)
        conditions.push(`issues.status = $${values.length}`)
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
    }

    query +=
        sort === "oldest"
            ? ` ORDER BY issues.created_at ASC`
            : ` ORDER BY issues.created_at DESC`

    const result = await pool.query(query, values)

    return result.rows.map((issue) => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,

        reporter: {
            id: issue.reporter_id,
            name: issue.reporter_name,
            role: issue.reporter_role,
        },

        created_at: issue.created_at,
        updated_at: issue.updated_at,
    }))
}

const getIssueByIdFromDB = async (id: string) => {
    const query = `
    SELECT
      issues.id,
      issues.title,
      issues.description,
      issues.type,
      issues.status,
      issues.created_at,
      issues.updated_at,

      users.id AS reporter_id,
      users.name AS reporter_name,
      users.role AS reporter_role

    FROM issues
    JOIN users ON issues.reporter_id = users.id
    WHERE issues.id = $1
  `

    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
        return null
    }

    const issue = result.rows[0]

    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,

        reporter: {
            id: issue.reporter_id,
            name: issue.reporter_name,
            role: issue.reporter_role,
        },

        created_at: issue.created_at,
        updated_at: issue.updated_at,
    }
}   

export const issueService = {
    getAllIssuesFromDB,
    getIssueByIdFromDB,
    createIssueIntoDB
}