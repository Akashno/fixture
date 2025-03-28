import { Team } from '~/server/models/team.model'

export default defineEventHandler(async (event) => {
    const method = event.method
    const id = getRouterParam(event, 'id')

    try {
        switch (method) {
            case 'GET': {
                if (id) {
                    const team = await Team.findById(id)
                    if (!team) {
                        throw createError({
                            statusCode: 404,
                            message: 'Team not found'
                        })
                    }
                    return team
                }
                return await Team.find().lean()
            }

            case 'POST': {
                const body = await readBody(event)
                const team = new Team(body)
                await team.save()
                return {
                    success: true,
                    data: team
                }
            }

            case 'PUT': {
                if (!id) {
                    throw createError({
                        statusCode: 400,
                        message: 'Team ID is required'
                    })
                }
                const body = await readBody(event)
                const updatedTeam = await Team.findByIdAndUpdate(
                    id,
                    { $set: body },
                    { new: true }
                )
                if (!updatedTeam) {
                    throw createError({
                        statusCode: 404,
                        message: 'Team not found'
                    })
                }
                return {
                    success: true,
                    data: updatedTeam
                }
            }

            case 'DELETE': {
                if (!id) {
                    throw createError({
                        statusCode: 400,
                        message: 'Team ID is required'
                    })
                }
                const deletedTeam = await Team.findByIdAndDelete(id)
                if (!deletedTeam) {
                    throw createError({
                        statusCode: 404,
                        message: 'Team not found'
                    })
                }
                return {
                    success: true,
                    data: deletedTeam
                }
            }

            default:
                throw createError({
                    statusCode: 405,
                    message: 'Method not allowed'
                })
        }
    } catch (error: any) {
        console.error('Server error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message
        })
    }
})