const Query = {
    hello: () => 'Welcome',
    
    notes: async (
        parent: any, 
        args: any, 
        ctx: { models: { Note: any, User: any }, user: any }
    ) => {
        return await ctx.models.Note.find({}).limit(100);
    },

    note: async (
        parent: any, 
        args: { id: string }, 
        ctx: { models: { Note: any, User: any }, user: any }
    ) => {
        return await ctx.models.Note.findById(args.id);
    },

    user: async(
        parent: any, 
        args: { username: string }, 
        ctx: { models: { Note: any, User: any }, user: any }
    ) => {
        return await ctx.models.User.findOne({ username: args.username });
    },

    users: async(
        parent: any, 
        args: any, 
        ctx: { models: { Note: any, User: any }, user: any }
    ) => {
        return await ctx.models.User.find({});
    },

    me: async(
        parent: any, 
        args: any, 
        ctx: { models: { Note: any, User: any }, user: any }
    ) => {
        return await ctx.models.User.findById(ctx.user.id);
    },

    noteFeed: async (
        parent: any, 
        args: { cursor: string }, 
        ctx: { models: { Note: any, User: any }, user: any }
    ) => {
        const limit = 10;
        let hasNextPage = false;
        let cursorQuery = {};
        
        if (args.cursor) {
            cursorQuery = { _id: { $lt: args.cursor } };
        }   
        let notes = await ctx.models.Note.find(cursorQuery)
            .sort({ _id: -1 })
            .limit(limit + 1);
        
        if (notes.length > limit) {
            hasNextPage = true;
            notes = notes.slice(0, -1);
        }
        
        const newCursor = notes[notes.length - 1]._id;
    
        return {
            notes,
            cursor: newCursor,
            hasNextPage
        };
    }
}

export default Query;