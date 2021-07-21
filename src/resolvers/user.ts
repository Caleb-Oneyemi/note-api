const notes = async (
    user: any, 
    args: any, 
    ctx: { models: { Note: any, User: any }, user: any }
) => {
    return await ctx.models.Note.find({ author: user._id }).sort({ _id: -1 });
}

const favorites = async (
    user: any, 
    args: any, 
    ctx: { models: { Note: any, User: any }, user: any }
) => {
    return await ctx.models.Note.find({ favoritedBy: user._id }).sort({ _id: -1 });
}


const User = {
    notes,
    favorites
};

export default User