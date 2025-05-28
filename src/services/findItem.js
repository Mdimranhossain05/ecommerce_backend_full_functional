const { MongooseError } = require('mongoose');
const createError = require('http-errors');

const findWithID = async (Model, id, options={}) => {
    try {
        const item = await Model.findById(id, options);

        if(!item){
            throw createError(404, `${Model.modelName} Item not found`);
        }
        return item;
        
    } catch (error) {
        if(error instanceof MongooseError){
            throw createError(400, `${Model.modelName} id does not exists`);
        }
        throw createError(404, `${Model.modelName} was not found`);
    }
}

module.exports = {findWithID};