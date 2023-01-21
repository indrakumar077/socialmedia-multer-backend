import express  from  "express";
import { createPost, DeletePost, getPost, getTimeLinePosts, likePost, UpdatePost } from "../Controllers/PostController.js";

const router = express.Router();

router.post('/',createPost);
router.get('/:id',getPost);
router.put('/:id',UpdatePost);
router.delete('/:id',DeletePost);
router.put('/like/:id',likePost);
router.get('/:id/timeline',getTimeLinePosts);


export default router;