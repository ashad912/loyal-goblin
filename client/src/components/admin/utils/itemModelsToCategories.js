const itemModelsArrayToCategories = (array) => {
    const categorisedArray = {}
    array.forEach(itemModel => {
        if(categorisedArray.hasOwnProperty(itemModel.type)){
            categorisedArray[itemModel.type].push(itemModel) 
        }else{
            categorisedArray[itemModel.type] = [itemModel]
        }
    });
    return categorisedArray
    
}

export default itemModelsArrayToCategories