import UserModel from "../Models/UserModel.js";
import bcrypt  from "bcrypt";

import jwt from"jsonwebtoken"


 export const getUser = async (req,res) =>{

      const id = req.params.id;

      try {

         const user = await UserModel.findById(id);
         if(user){

            //   const {password,...otherdetails} = user._doc;
             res.status(200).send(user._doc);
         }
         else{
            res.status(404).json("not user");
         }
        
      } catch (error) {
            res.status(500).json(error);
      } 

};


export  const updateUser =async (req,res) =>{
    
     console.log(req.body);
     const id = req.params.id;
     const{ _id,...other} = req.body;
     const{ isAdmin,password} = other;
     const  currentUserId = _id;
     const currentUserAdminStatus = isAdmin;

     if(id === currentUserId || currentUserAdminStatus){
         
         try { 

             if(password){

                 const salt = await bcrypt.genSalt(10);
                 req.body.password = await bcrypt.hash(password,salt);
                 
             }

                
                const user = await UserModel.findByIdAndUpdate(id,req.body,{new:true});
                const token = jwt.sign({
                  username : user.username ,
                  id: user._id,
                },process.env.JWT_KEY)
                res.status(200).send({user,token});
             
         } catch (error) {
            res.status(500).json(error);
         }
     }
     else{
        res.status(403).send("its not your profile access denied");
     }
  
}


export const deleteUser = async(req,res) =>{
     
      const id = req.params.id;
      const {currentUserAdminStatus,currentUserId} = req.body;

      
      
               if(currentUserAdminStatus || currentUserId==id){

                  try {
                        await UserModel.findByIdAndDelete(id);
                        res.status(200).send("deletion done");
                        

                     } catch (error) {

                        res.status(500).json(error);
                     }
               }
               else{
                  res.status(403).send("dont try to delete other user")
               }  
}


export const followUser = async(req,res) =>{

      const id = req.params.id;
   
      const{_id} = req.body.data;
      // console.log(_id);
      const currentUserId = _id;
      if(currentUserId == id){
          res.status(403).send("you cant follow your self");
      }
      else{

         try {

            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserId);

             if(!followUser.followers.includes(currentUserId)){
                   await followUser.updateOne({$push : {followers : currentUserId}});
                   await followingUser.updateOne({$push:{following : id}});
                   res.status(200).send("user followed");
             } 
             else{
               res.status(403).send("already followed");
             }
            
         } catch (error) {
            res.status(500).json(error);
         }
      }

}


export const UnfollowUser = async(req,res) =>{

   const id = req.params.id;
   
   const{_id} = req.body.data;
  
   const currentUserId = _id;
   if(currentUserId == id){
       res.status(403).send("you cant follow your self");
   }
   else{

      try {

         const followUser = await UserModel.findById(id);
         const followingUser = await UserModel.findById(currentUserId);

          if(followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$pull : {followers : currentUserId}});
                await followingUser.updateOne({$pull:{following : id}});
                res.status(200).send("user unfollowed");
          } 
          else{
            res.status(403).send("user not followed by you");
          }
         
      } catch (error) {
         res.status(500).json(error);
      }
   }

}


export const getAllUser = async(req,res)=>{
     
       try {
         let users = await UserModel.find();
         
          users = users.map((user)=>{
               const {password , ...other} = user._doc;
               return other;
          })


         res.status(200).send(users);
       } catch (error) {
          
         res.status(500).send(error);
       }
}