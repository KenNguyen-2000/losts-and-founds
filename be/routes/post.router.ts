import express from 'express';
import postController from '../controllers/post.controller';
import {
  authMiddleware,
  isPostOwnerMiddleware,
} from '../middleware/auth.middleware';
import { uploadFilesMiddleware } from '../middleware/upload-img.middleware';
const stripe = require('stripe')(
  'sk_test_51MlohlKIBca3SmNV3O8ppOcB1ZVei3CRdeUh0Xdpzwv6gvaPinumgq5KKmrcDKCydPyCjFZKJSRL9XrfAiYhRQfB00fN4oHelR'
);

const postRouter = express.Router();

postRouter
  .route('/')
  .get([authMiddleware], postController.getPostList)
  .post([authMiddleware, uploadFilesMiddleware], postController.createPost);

postRouter
  .route('/created')
  .get([authMiddleware], postController.getCreatedPostList);

postRouter
  .route('/:postId')
  .get([authMiddleware], postController.getPost)
  .put(
    [authMiddleware, isPostOwnerMiddleware, uploadFilesMiddleware],
    postController.updatePost
  )
  .delete([authMiddleware, isPostOwnerMiddleware], postController.deletePost);

postRouter
  .route('/like/:postId')
  .put([authMiddleware], postController.likePost);

postRouter
  .route('/dislike/:postId')
  .put([authMiddleware], postController.dislikePost);

postRouter
  .route('/comment/:postId')
  .put([authMiddleware], postController.commentPost);

postRouter
  .route('/:postId/create-checkout-session')
  .post([authMiddleware], postController.getCheckoutPage);

// Fetch the Checkout Session to display the JSON result on the success page
postRouter.get('/checkout-session', async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

postRouter
  .route('/auction/raise/:postId')
  .put([authMiddleware], postController.raisePrice);

postRouter
  .route('/handle-successful-payment')
  .post([authMiddleware], postController.handleSuccessfulPayment);

export default postRouter;
