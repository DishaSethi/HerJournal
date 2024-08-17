const applyFilters=(req,res,next)=>{
    const {author,tags,startDate, endDate,sortBy,order}=req.query;

    let filter={};

    // Author filter
    if(author){
        filter.author=author;
    }

    // Tags filter
    if(tags){
        const tagsArray=tags.split(',').map(tag=> tag.trim());

        filter.tags={$in: tagsArray};
    }

    // Apply date range filter
    if(startDate|| endDate){
        filter.createdAt={};
        if(startDate) 
        {
            filter.createdAt.$gte=new Date(startDate);

        }

        if(endDate){
            filter.createdAt.$lte=new Date(endDate);
        }
    };

        let sortOptions={};
        if(sortBy){
            sortOptions[sortBy]=order==='desc'?-1:1;
        }else {
            sortOptions={createdAt:-1};
        }

       req.filter=filter;
       req.options={
        sort:sortOptions,
       }
       next();

    


};

module.exports={
    applyFilters};