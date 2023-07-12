


export const updatesutil = async(model, id, userId,updates) => {
    try {
        const post = await model.findById(id);

        if (!post) {
            throw new Error('Post not found');
        }

        if (post.authorId.toString() !== userId) {
            throw new Error('You are not authorized to update this post');
        }
        return await model.findByIdAndUpdate(id, updates, { new: true }).then(result => result);
        // return post;
    } catch (err) {
        console.log(err);
        throw err;
    }
}