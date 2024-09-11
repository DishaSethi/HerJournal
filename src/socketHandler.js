const Comment=require('./models/comment');

module.exports=function(io){
    io.on('connection',(socket)=>{
        console.log(`A user connected`,socket.id);

        // Handle a new comment event

        socket.on('newComment',async(data)=>{
            const {blogId,content,user}=data;

            try{
                // save the comment in the databse
            }
        })
    })
}