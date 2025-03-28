import { Tournament } from '~/server/models/tournament.model'

export default defineEventHandler(async (event) => {
    const method = event.method
    const id = getRouterParam(event, 'id')
    const path = event.path

    try {
        // Handle nested routes first
        if (id && path.includes('/fixtures')) {
            switch (method) {
                case 'GET': {
                    const tournament = await Tournament.findById(id).populate('fixtures')
                    if (!tournament) {
                        throw createError({
                            statusCode: 404,
                            message: 'Tournament not found'
                        })
                    }
                    return tournament.fixtures
                }
                case 'POST': {
                    const body = await readBody(event)
                    const tournament = await Tournament.findById(id)
                    if (!tournament) {
                        throw createError({
                            statusCode: 404,
                            message: 'Tournament not found'
                        })
                    }
                    tournament.fixtures.push(body)
                    await tournament.save()
                    return {
                        success: true,
                        data: tournament
                    }
                }
            }
        }

        if (id && path.includes('/points')) {
            if (method === 'GET') {
                const tournament = await Tournament.findById(id).populate('points')
                if (!tournament) {
                    throw createError({
                        statusCode: 404,
                        message: 'Tournament not found'
                    })
                }
                return tournament.points
            }
        }

        // Handle main tournament routes
        switch (method) {
            case 'GET': {
                if (id) {
                    const tournament = await Tournament.findById(id).populate('selectedTeams')
                    if (!tournament) {
                        throw createError({
                            statusCode: 404,
                            message: 'Tournament not found'
                        })
                    }
                    return tournament
                }
                return await Tournament.find().populate('selectedTeams').sort({ createdAt: -1 })
            }

            case 'POST': {
                const body = await readBody(event)
                if (!body.name || !body.selectedTeams || !Array.isArray(body.selectedTeams) || body.selectedTeams.length === 0) {
                    throw createError({
                        statusCode: 400,
                        message: 'Name and selected teams are required'
                    })
                }
                const tournament = await Tournament.create({
                    name: body.name,
                    selectedTeams: body.selectedTeams
                })
                return {
                    success: true,
                    data: tournament
                }
            }

            case 'DELETE': {
                if (!id) {
                    throw createError({
                        statusCode: 400,
                        message: 'Tournament ID is required'
                    })
                }
                const deletedTournament = await Tournament.findByIdAndDelete(id)
                if (!deletedTournament) {
                    throw createError({
                        statusCode: 404,
                        message: 'Tournament not found'
                    })
                }
                return {
                    success: true,
                    data: deletedTournament
                }
            }

            default:
                throw createError({
                    statusCode: 405,
                    message: 'Method not allowed'
                })
        }
    } catch (error: any) {
        console.error('Error in tournament handler:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message
        })
    }
})