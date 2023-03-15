import { ICommentPost } from './../interfaces/dto/post.dto';
import { IPost } from './../models/post.model';
import { NextFunction, Request, Response } from 'express';
import postService from '../services/post.service';
import { IUpdatePost } from '../interfaces/dto/post.dto';
import {
  InternalServerError,
  BaseError,
  NotFoundError,
  BadRequestError,
} from '../errors/error';
import { RequestQueryOpts } from '../interfaces/common/Request';
import path from 'path';
import url from 'url';
import userService from '../services/user.service';
const stripe = require('stripe')(
  'sk_test_51MlohlKIBca3SmNV3O8ppOcB1ZVei3CRdeUh0Xdpzwv6gvaPinumgq5KKmrcDKCydPyCjFZKJSRL9XrfAiYhRQfB00fN4oHelR'
);

class PostController {
  async createPost(req: Request, res: Response, next: NextFunction) {
    const { description, location, postType, itemName }: IPost = req.body;
    const { user, files } = req;
    try {
      if (!files) {
        next(new BadRequestError('At least one image required!'));
      }
      const images: string[] = (files as Express.Multer.File[])?.map(
        (file: Express.Multer.File) => {
          return file.filename;
        }
      );
      const newPost: IPost = await postService.createPost({
        description,
        images,
        postType,
        createdBy: user?._id,
        location,
        itemName,
      });

      if (newPost) {
        res
          .status(201)
          .json({ post: newPost, message: 'Create post successfully!' });
      }
    } catch (error) {
      next(error);
    }
  }

  async getPostList(req: Request, res: Response, next: NextFunction) {
    const {
      search = '',
      pageNo = '0',
      pageSize = '3',
      sortBy: sortByParam,
      postType,
    }: RequestQueryOpts = req.query;

    const filter = postType ? { postType } : {};

    const sortBy: any = Array.isArray(sortByParam)
      ? sortByParam.map((sort) => {
          const [field, direction] = sort.split(':');
          return [field, -1];
        })
      : [];

    try {
      const posts: IPost[] = await postService.getPostList({
        search,
        sortBy,
        pageNo: parseInt(pageNo),
        pageSize: parseInt(pageSize),
        filter,
      });

      if (posts) {
        res.status(200).json({
          message: 'Get posts list successfully!',
          posts,
          hasMore: posts.length === 0 ? false : true,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getCreatedPostList(req: Request, res: Response, next: NextFunction) {
    const { user } = req;
    try {
      const posts: IPost[] = await postService.getCreatedPostList(user?._id);

      if (posts) {
        res
          .status(200)
          .json({ message: 'Get posts list successfully!', posts });
      }
    } catch (error) {
      next(error);
    }
  }

  async getPost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    try {
      const post: IPost = await postService.getPost(postId);
      if (post) {
        res.status(200).json({ message: 'Get post successfully!', post });
      } else {
        next(new NotFoundError('Post id does not exist!'));
      }
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    const { description, location, postType, itemName }: IUpdatePost = req.body;
    const { files } = req;

    let updatedFiels: IUpdatePost = {
      _id: postId,
      description,
      location,
      postType,
      itemName,
    };

    if (files?.length! > 0) {
      updatedFiels.images = (files as Express.Multer.File[])?.map(
        (file: Express.Multer.File) => {
          return file.filename;
        }
      );
    }
    try {
      const updatedPost: IPost = await postService.updatePost(updatedFiels);
      if (updatedPost) {
        res
          .status(200)
          .json({ message: 'Update post successfully!', post: updatedPost });
      } else {
        next(new NotFoundError('Post id does not exist!'));
      }
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    try {
      await postService.deletePost(postId);
      res.status(200).json({ message: 'Delete post successfully!' });
    } catch (error) {
      next(error);
    }
  }

  async likePost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    const { user } = req;

    try {
      const updatedPost = await postService.likePost(postId, user?._id);

      if (updatedPost) {
        res
          .status(200)
          .json({ message: 'Like post successfully!', post: updatedPost });
      } else {
        next(new InternalServerError('Something went wrong!'));
      }
    } catch (error) {
      next(error);
    }
  }

  async dislikePost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    const { user } = req;

    try {
      const updatedPost = await postService.dislikePost(postId, user?._id);
      if (updatedPost) {
        res
          .status(200)
          .json({ message: 'Dislike post successfully!', post: updatedPost });
      } else {
        next(new InternalServerError('Something went wrong!'));
      }
    } catch (error) {
      next(error);
    }
  }

  async commentPost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    const { description } = req.body;
    const { user } = req;
    description;

    try {
      const updatedPost = await postService.commentPost({
        postId,
        description,
        createdBy: user?._id,
      });

      if (updatedPost) {
        res
          .status(200)
          .json({ message: 'Comment post successfully!', updatedPost });
      } else {
        next(new InternalServerError('Something went wrong!'));
      }
    } catch (error) {
      next(error);
    }
  }

  async checkoutSession(req: Request, res: Response, next: NextFunction) {
    const { sessionId } = req.query;
    console.log(sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
  }

  async raisePrice(req: Request, res: Response, next: NextFunction) {
    const { priceStep, minPrice } = req.body;
    const { postId } = req.params;
    const { user } = req;
    try {
      const updatedPost = await postService.raisePrice({
        priceStep,
        postId,
        raisedUser: user?._id,
        minPrice,
      });

      res
        .status(200)
        .json({ message: 'Raise price successfully!', post: updatedPost });
    } catch (error) {
      next(error);
    }
  }

  async getCheckoutPage(req: Request, res: Response, next: NextFunction) {
    const { amount, itemName } = req.body;
    const { user } = req;
    const { postId } = req.params;

    const post: any = await postService.getPost(postId as string);

    try {
      // Create a new product and price for the item being sold
      const product = await stripe.products.create({
        name: itemName,
      });

      const stripePrice = await stripe.prices.create({
        unit_amount: amount + '00',
        currency: 'usd',
        product: product.id,
      });
      console.log(post);
      // Look up the connected account ID associated with the seller's email
      const connectedAccounts = await stripe.accounts.retrieve(
        post.createdBy.stripe_account_ID
      );

      const connectedAccountId = connectedAccounts.id;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: stripePrice.id,
            quantity: 1,
          },
        ],
        success_url: `http://localhost:3000/profile?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: 'http://localhost:3000/post-list',
        mode: 'payment',
        customer_email: user!.email,
      });

      res
        .status(200)
        .json({ message: 'redirect', url: session.url, sessionId: session.id });
    } catch (error) {
      next(error);
    }
  }

  async handleSuccessfulPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { sessionId } = req.body;
    const { user } = req;
    try {
      const checkoutSession = await stripe.checkout.sessions.retrieve(
        sessionId
      );
      const paymentIntentId: string = checkoutSession.payment_intent;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      // Retrieve the connected account ID associated with the seller's email
      const connectedAccountId = 'acct_1Mlus72cFuKOJfrs';

      // Calculate the amount to transfer to the seller, taking into account the application fee
      const amount =
        paymentIntent.amount - paymentIntent.application_fee_amount;

      // Create a payout to the seller
      const payout = await stripe.payouts.create({
        amount,
        currency: 'usd',
        destination: {
          stripe_account: connectedAccountId,
        },
      });

      console.log(
        `Initiated payout of ${
          amount / 100
        } USD to account ${connectedAccountId} with ID ${payout.id}`
      );
      res.status(200).json({
        message: `Initiated payout of ${
          amount / 100
        } USD to account ${connectedAccountId} with ID ${payout.id}`,
      });
    } catch (error: any) {
      console.error(`Error handling successful payment: ${error.message}`);
      throw error;
    }
  }
}

const postController = new PostController();

export default postController;
