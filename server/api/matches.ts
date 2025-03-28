import { Match } from '~/server/models/match.model'
import { updateTournamentStats } from '~/server/utils/tournament'

export default defineEventHandler(async (event) => {
    const method = event.method
    const id = getRouterParam(event, 'id')
    const path = event.path

    try {
        // Handle match score updates
        if (id && path.includes('/score')) {
            if (method === 'PUT') {
                const body = await readBody(event)
                const { homeScore, awayScore } = body

                // Validate score data
                if (!homeScore || !awayScore) {
                    throw createError({
                        statusCode: 400,
                        message: 'Both home and away scores are required'
                    })
                }

                // Validate overs format
                const validateOvers = (overs: number): boolean => {
                    const oversStr = overs.toString()
                    if (!oversStr.includes('.')) return true
                    const decimal = parseFloat(oversStr.split('.')[1])
                    return decimal < 6
                }

                if (!validateOvers(homeScore.overs) || !validateOvers(awayScore.overs)) {
                    throw createError({
                        statusCode: 400,
                        message: 'Invalid overs format. Decimal part should be less than 6'
                    })
                }

                const match = await Match.findById(id)
                if (!match) {
                    throw createError({
                        statusCode: 404,
                        message: 'Match not found'
                    })
                }

                match.homeScore = homeScore
                match.awayScore = awayScore
                match.status = 'completed'

                await match.save()

                // Update tournament stats
                await updateTournamentStats(match.tournament)

                return {
                    success: true,
                    data: match
                }
            }
        }

        // Handle other match operations
        switch (method) {
            case 'GET': {
                if (id) {
                    const match = await Match.findById(id)
                        .populate('homeTeam')
                        .populate('awayTeam')
                    if (!match) {
                        throw createError({
                            statusCode: 404,
                            message: 'Match not found'
                        })
                    }
                    return match
                }
                return await Match.find()
                    .populate('homeTeam')
                    .populate('awayTeam')
                    .sort({ createdAt: -1 })
            }

            default:
                throw createError({
                    statusCode: 405,
                    message: 'Method not allowed'
                })
        }
    } catch (error: any) {
        console.error('Error in match handler:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message
        })
    }
})