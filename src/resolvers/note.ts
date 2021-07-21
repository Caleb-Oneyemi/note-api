const author = async (
    note: any, 
    args: any, 
    ctx: { models: { Note: any, User: any }, user: any }
) => {
  return await ctx.models.User.findById(note.author);
}

const favoritedBy = async (
    note: any, 
    args: any, 
    ctx: { models: { Note: any, User: any }, user: any }
) => {
    return await ctx.models.User.find({ _id: { $in: note.favoritedBy } });
}


const Note = {
    author,
    favoritedBy    
};

export default Note;
  