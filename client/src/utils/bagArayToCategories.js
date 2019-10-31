const bagArrayToCategories = (bag) => {
    const categorisedBag = {}
    bag.forEach(item => {
        if(categorisedBag.hasOwnProperty(item.itemModel.type.type)){
            categorisedBag[item.itemModel.type.type].push(item) 
        }else{
            categorisedBag[item.itemModel.type.type] = [item]
        }
    });
    return categorisedBag
    
}

export default bagArrayToCategories