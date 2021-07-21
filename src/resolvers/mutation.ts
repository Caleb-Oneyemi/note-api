import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import gravatar from '../util/gravatar';
import dotenv from 'dotenv';

dotenv.config();

const Mutation = {
    newNote: async (
        parent: any, 
        args: { content: string }, 
        ctx: { models: { Note: any, User: any }, user: any }
    ) => {
        if (!ctx.user) {
            throw new AuthenticationError('You must be signed in to create a note'); 
        }

        return await ctx.models.Note.create({ 
            content: args.content, 
            author: mongoose.Types.ObjectId(ctx.user.id)
        });
    },
    updateNote: async(
        parent: any, 
        args: { id: string, content: string }, 
        ctx: { models: { Note: any, User: any }, user: any }
    ) => {
        if (!ctx.user) {
            throw new AuthenticationError('You must be signed in to update a note');
        }
        
        const note = await ctx.models.Note.findById(args.id);
        if (note && String(note.author) !== ctx.user.id) {
            throw new ForbiddenError('You don\'t have permissions to update the note');
        }
      
        return await ctx.models.Note.findOneAndUpdate(
            { _id: args.id },
            { $set: { content: args.content } },
            { new: true }
        );
    },
    deleteNote: async(
        parent: any, 
        args: { id: string, content: string }, 
        ctx: { models: { Note: any, User: any }, user: any }
    ) => {
        if (!ctx.user) {
            throw new AuthenticationError('You must be signed in to delete a note');
        }
          
        const note = await ctx.models.Note.findById(args.id);
        if (note && String(note.author) !== ctx.user.id) {
            throw new ForbiddenError('You don\'t have permissions to delete the note');
        }
      
        try {
            await note.remove();
            return true;
        } catch (err) {
            return false;
        }
    },
    signUp: async(
        parent: any, 
        args: { username: string, email: string, password: string }, 
        ctx: { models: { Note: any, User: any }, user: any }
    ) => {
        const hashedPassword = await bcrypt.hash(args.password, 10);
        const avatar = gravatar(args.email);

        try {
            const user = await ctx.models.User.create({
                username: args.username,
                email: args.email,
                avatar,
                password: hashedPassword
            })

            return jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
        } catch(err) {
            console.log(err);
            throw new Error('Error creating account');
        }
    },
    signIn: async(
        parent: any, 
        args: { username: string, email: string, password: string }, 
        ctx: { models: { Note: any, User: any }, user: any }
    ) => {
        const user = await ctx.models.User.findOne({
            $or: [{ email: args.email }, { username: args.username }]
        });

        if(!user) {
            throw new AuthenticationError('Error signing in');
        }

        const isMatch = await bcrypt.compare(args.password, user.password);
        if(!isMatch) {
            throw new AuthenticationError('Error signing in');
        }

        return jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
    },
    toggleFavorite: async (
        parent: any, 
        args: { id: string }, 
        ctx: { models: { Note: any, User: any }, user: any }
    ) => {
        if (!ctx.user) {
          throw new AuthenticationError('You must be signed in to like notes');
        } 
        let noteCheck = await ctx.models.Note.findById(args.id);
        const hasUser = noteCheck.favoritedBy.indexOf(ctx.user.id);

        if (hasUser >= 0) {
            return await ctx.models.Note.findByIdAndUpdate(
                args.id,
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(ctx.user.id)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                { new: true }
            );
        } else {
            return await ctx.models.Note.findByIdAndUpdate(
                args.id,
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(ctx.user.id)
                    },
                    $inc: {
                        favoriteCount: 1
                    }
                },
                { new: true }
            );
        }
    },
}

export default Mutation;