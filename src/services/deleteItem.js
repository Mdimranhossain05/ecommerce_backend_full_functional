const { MongooseError } = require('mongoose');
const createError = require('http-errors');

const deleteWithID = async (Model, id, options={}) => {
    try {
        const deletedItem = await Model.findOneAndDelete({_id:id, ...options} );

        if (!deletedItem){
            throw createError(404, `${Model.modelName} was not found for delete`);
        }
        return deletedItem;

    } catch (error) {
        if (error instanceof MongooseError) {
            throw createError(400, `${Model.modelName} does not exists`);
        }
        throw createError(404, `${Model.modelName} Item was not found for delete`);
    }
}

module.exports = { deleteWithID };