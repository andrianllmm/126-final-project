import 'dotenv/config';
import {
  PrismaClient,
  ListingCondition,
  ListingStatus,
  TransactionStatus,
  ReviewRole,
  NotificationType,
} from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../src/config/env.js';
import { auth } from '../src/modules/auth/auth.config.js';

const adapter = new PrismaPg({
  connectionString: env.databaseUrl as string,
});

const prisma = new PrismaClient({ adapter });

const LISTING_CATEGORIES = [
  { categoryName: 'Electronics', slug: 'electronics' },
  { categoryName: 'Books', slug: 'books' },
  { categoryName: 'Furniture', slug: 'furniture' },
  { categoryName: 'Clothing', slug: 'clothing' },
  { categoryName: 'Other', slug: 'other' },
];

// Helper to simulate upload records
async function createUpload(url: string, key: string) {
  return prisma.upload.create({
    data: {
      key,
      url,
      mimeType: 'image/jpeg',
      size: 123456,
    },
  });
}

async function main() {
  const now = new Date();

  // CLEAN
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.savedListing.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.upload.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  await prisma.listingCategory.deleteMany();

  // USERS
  await auth.api
    .signUpEmail({
      body: {
        email: 'seller@up.edu.ph',
        password: 'password123',
        name: 'Seller One',
      },
    })
    .catch(console.error);

  await auth.api
    .signUpEmail({
      body: {
        email: 'buyer@up.edu.ph',
        password: 'password123',
        name: 'Buyer One',
      },
    })
    .catch(console.error);

  const seller = await prisma.user.findUniqueOrThrow({
    where: { email: 'seller@up.edu.ph' },
  });

  const buyer = await prisma.user.findUniqueOrThrow({
    where: { email: 'buyer@up.edu.ph' },
  });

  const sellerAvatar = await createUpload(
    'https://i.pravatar.cc/150?img=12',
    `seed-avatar-seller-${Date.now()}`,
  );

  const buyerAvatar = await createUpload(
    'https://i.pravatar.cc/150?img=32',
    `seed-avatar-buyer-${Date.now()}`,
  );

  await prisma.user.update({
    where: { id: seller.id },
    data: {
      avatarUploadId: sellerAvatar.id,
    },
  });

  await prisma.user.update({
    where: { id: buyer.id },
    data: {
      avatarUploadId: buyerAvatar.id,
    },
  });

  // CATEGORIES
  await prisma.listingCategory.createMany({
    data: LISTING_CATEGORIES,
  });

  const electronics = await prisma.listingCategory.findUniqueOrThrow({
    where: { slug: 'electronics' },
  });

  const books = await prisma.listingCategory.findUniqueOrThrow({
    where: { slug: 'books' },
  });

  // LISTINGS
  const keyboard = await prisma.listing.create({
    data: {
      sellerId: seller.id,
      title: 'Mechanical Keyboard',
      description:
        'Barely used 75% mechanical keyboard with hot-swappable switches.',
      price: '2500.00',
      categoryId: electronics.id,
      condition: ListingCondition.LIKE_NEW,
      status: ListingStatus.AVAILABLE,
      meetupLocation: 'TLRC',
    },
  });

  const textbook = await prisma.listing.create({
    data: {
      sellerId: seller.id,
      title: 'C Programming Language',
      description: 'Clean copy with minimal markings.',
      price: '1799.00',
      categoryId: books.id,
      condition: ListingCondition.GOOD,
      status: ListingStatus.SOLD,
      meetupLocation: 'UPV Main Gate',
      soldAt: now,
    },
  });

  // UPLOADS

  const keyboardUpload = await createUpload(
    'https://upload.wikimedia.org/wikipedia/commons/0/0a/QWERTY_keyboard.jpg',
    `seed-keyboard-${Date.now()}`,
  );

  const textbookUpload = await createUpload(
    'https://upload.wikimedia.org/wikipedia/commons/c/c7/Americanstudbookvolume2open.jpg',
    `seed-textbook-${Date.now()}`,
  );

  // LISTING IMAGES

  await prisma.listingImage.createMany({
    data: [
      {
        listingId: keyboard.id,
        uploadId: keyboardUpload.id,
        sortOrder: 0,
      },
      {
        listingId: textbook.id,
        uploadId: textbookUpload.id,
        sortOrder: 0,
      },
    ],
  });

  // SAVED LISTING
  await prisma.savedListing.create({
    data: {
      userId: buyer.id,
      listingId: keyboard.id,
    },
  });

  // CONVERSATION + MESSAGES
  const conversation = await prisma.conversation.create({
    data: {
      listingId: keyboard.id,
      buyerId: buyer.id,
      sellerId: seller.id,
      lastMessageAt: now,
      messages: {
        create: [
          {
            senderId: buyer.id,
            content: 'Is this still available?',
            createdAt: now,
          },
          {
            senderId: seller.id,
            content: 'Yes, still available.',
            createdAt: now,
          },
        ],
      },
    },
  });

  // TRANSACTION
  const transaction = await prisma.transaction.create({
    data: {
      listingId: textbook.id,
      buyerId: buyer.id,
      sellerId: seller.id,
      agreedPrice: '1700.00',
      status: TransactionStatus.COMPLETED,
      completedAt: now,
    },
  });

  // REVIEWS
  await prisma.review.createMany({
    data: [
      {
        reviewerId: buyer.id,
        revieweeId: seller.id,
        listingId: textbook.id,
        transactionId: transaction.transactionId,
        rating: 5,
        comment: 'Smooth transaction and accurate listing.',
        role: ReviewRole.BUYER_TO_SELLER,
      },
      {
        reviewerId: seller.id,
        revieweeId: buyer.id,
        listingId: textbook.id,
        transactionId: transaction.transactionId,
        rating: 5,
        comment: 'Fast payment and easy to deal with.',
        role: ReviewRole.SELLER_TO_BUYER,
      },
    ],
  });

  // NOTIFICATIONS
  await prisma.notification.createMany({
    data: [
      {
        userId: seller.id,
        type: NotificationType.MESSAGE,
        title: 'New message',
        message: 'You received a message about your listing.',
      },
      {
        userId: buyer.id,
        type: NotificationType.TRANSACTION,
        title: 'Transaction completed',
        message:
          'Your transaction for Discrete Mathematics Textbook was completed.',
      },
      {
        userId: seller.id,
        type: NotificationType.RATING,
        title: 'New review',
        message: 'You received a new seller review.',
      },
      {
        userId: buyer.id,
        type: NotificationType.SYSTEM,
        title: 'Welcome',
        message: 'Demo data has been loaded successfully.',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
