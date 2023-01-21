import PostModel from "../Models/PostModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/UserModel.js";


export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body);
  
    try {
      await newPost.save();
      res.status(200).json(newPost);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  

  
  export const getPost = async (req, res) => {
    const id = req.params.id;
  
    try {
      const post = await PostModel.findById(id);
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json(error);
    }
  };


export const UpdatePost = async (req,res)=>{
     
         const Postid = req.params.id;
         const {UserId} = req.body;

         try {
            
               const post =  await PostModel.findById(Postid);

               if(post.UserId == UserId){
                   
                await post.updateOne({$set : req.body});
                res.status(200).json("post updated")
               }
               else{
                  res.status(403).json("you cant change others post");
               }

            
         } catch (error) {
            res.status(500).json(error);
         }
       
}



export const DeletePost =  async (req,res) =>{

         const PostId = req.params.id; 
         const {UserId} = req.body;

      try { const Post =   await PostModel.findById(PostId);
            //  console.log(Post+" "+Post.UserId);
            if(UserId==Post.UserId){
                await Post.deleteOne();
                res.status(200).json("Post deleted");
            }
            else{
                res.status(403).json("you cant delete others post"); 
            }
    }catch(e){
            res.status(500).json(error);
        }
}


export const likePost = async (req,res) =>{

      const PostId = req.params.id;
      const {UserId} = req.body;

      try {

         const post = await PostModel.findById(PostId);

         if(!post.likes.includes(UserId)){

            await post.updateOne({$push : {likes: UserId}})
            res.status(200).json("Liked");
         }
         else{
            
              await post.updateOne({$pull:{likes:UserId}});
              res.status(200).json("DisLiked");
         }

        
      } catch (error) {
        
        res.status(500).json(error);

      }

}



export const getTimeLinePosts = async(req,res) =>{
          
    const userId = req.params.id;
    console.log(userId);

    try {

         const CurrentUserPost =  await PostModel.find({UserId : userId});
         const followingPosts = await UserModel.aggregate(
            [
                {
                    $match :{
                        _id: new mongoose.Types.ObjectId(userId)
                    },
                },
                {
                    $lookup :{
                        from : "posts",
                        localField : "following",
                        foreignField : "UserId",
                        as : "followingPosts"
                    },
                },
                {  
                     $project : {
                        followingPosts : 1,
                        _id : 0
                     },

                },


            ]
         );

         res.status(200).json(CurrentUserPost.concat(...followingPosts[0].followingPosts)
         .sort((a,b)=> {
            return b.createdAt - a.createdAt
           })
         ); 
        
    } catch (error) {
        res.status(500).json(error);
    }
     

}