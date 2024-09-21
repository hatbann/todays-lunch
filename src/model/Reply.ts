import mongoose, { InferSchemaType } from 'mongoose';

const { Schema } = mongoose;

export const ReplySchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  org: String,
});

ReplySchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

type ReplyType = InferSchemaType<typeof ReplySchema> & {
  _id: string;
};

export const Reply =
  mongoose.models.Replies || mongoose.model('Replies', ReplySchema);

export type { ReplyType };
