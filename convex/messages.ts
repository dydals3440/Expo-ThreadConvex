import { mutation, query, QueryCtx } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import { getCurrentUserOrThrow } from './users';
import { Id } from './_generated/dataModel';
import { internal } from './_generated/api';
import { v } from 'convex/values';

export const addThreadMessage = mutation({
  args: {
    content: v.string(),
    mediaFiles: v.optional(v.array(v.string())),
    websiteUrl: v.optional(v.string()),
    threadId: v.optional(v.id('messages')),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const message = await ctx.db.insert('messages', {
      ...args,
      userId: user._id as Id<'users'>,
      likeCount: 0,
      commentCount: 0,
      retweetCount: 0,
    });

    if (args.threadId) {
      // TODO
    }
    return message;
  },
});

export const getThreads = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    let threads;
    if (args.userId) {
      threads = await ctx.db
        .query('messages')
        .filter((q) => q.eq(q.field('userId'), args.userId))
        .order('desc')
        .paginate(args.paginationOpts);
    } else {
      threads = await ctx.db
        .query('messages')
        .filter((q) => q.eq(q.field('threadId'), undefined))
        .order('desc')
        .paginate(args.paginationOpts);
    }

    const messagesWithCreator = await Promise.all(
      threads.page.map(async (thread) => {
        const creator = await getMessageCreator(ctx, thread.userId);
        console.log(creator);

        return {
          ...thread,
          creator,
        };
      })
    );

    return {
      ...threads,
      page: messagesWithCreator,
    };
  },
});

const getMessageCreator = async (ctx: QueryCtx, userId: Id<'users'>) => {
  const user = await ctx.db.get(userId);

  if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
    return user;
  }

  const imageUrl = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>);

  return {
    ...user,
    imageUrl,
  };
};

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await getCurrentUserOrThrow(ctx);

    return await ctx.storage.generateUploadUrl();
  },
});
