import { Team } from '~/server/models/team.model'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    )
    
    if (!updatedTeam) {
      return {
        statusCode: 404,
        message: 'Team not found'
      }
    }

    return {
      statusCode: 200,
      data: updatedTeam
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      message: error.message || 'Internal server error'
    }
  }
})