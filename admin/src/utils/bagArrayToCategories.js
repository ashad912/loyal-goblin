const bagArrayToCategories = (bag) => {
    const categorisedBag = {}
    bag.forEach(item => {
        if(categorisedBag.hasOwnProperty(item.itemModel.type)){
            categorisedBag[item.itemModel.type].push(item) 
        }else{
            categorisedBag[item.itemModel.type] = [item]
        }
    });
    return categorisedBag
    
}

export default bagArrayToCategories