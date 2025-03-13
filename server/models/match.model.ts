import mongoose from 'mongoose'

const scoreSchema = new mongoose.Schema({
  runs: {
    type: Number,
    default: 0
  },
  wickets: {
    type: Number,
    default: 0,
    max: 10
  }
})

const matchSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  homeScore: scoreSchema,
  awayScore: scoreSchema,
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed'],
    default: 'scheduled'
  },
  matchDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  round:{
    type:Number,
    default:1
  }
})

export const Match = mongoose.model('Match', matchSchema)