import mongoose, { Schema } from 'mongoose';

const PipelineStepSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'IN_PROGRESS', 'FAILED'],
    default: 'PENDING',
  },
  error: {
    type: String,
    default: '',
  },
  params: {
    type: Schema.Types.Mixed,
  },
  startedAt: { type: Date },
  completedAt: { type: Date },
});

const PipelineSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    steps: [PipelineStepSchema],
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'IN_PROGRESS', 'FAILED'],
      default: 'PENDING',
    },
  },
  { timestamps: true },
);

export const Pipeline = mongoose.model('Pipeline', PipelineSchema);
