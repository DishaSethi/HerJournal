const User=require('../models/user');
const applyFilters=async (req,res,next)=>{
    const {author,tags,startDate, endDate,sortBy,order,keyword}=req.query;

    let filter={};

    // Author filter by username
    if(author){
        const user=await User.findOne({username:author.trim()});
       if(user){
        filter.author=user._id;
       }else{
        filter.author=null;
       }
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

    if(keyword){
        const keywordRegex=new RegExp(keyword,'i'); //'i' makes it case-insensitive
        filter.$or=[
            {title:keywordRegex},
            {content:keywordRegex},
            {tags:keywordRegex},
        ];
    }

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