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
  await prisma.likedListing.deleteMany();
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
        phoneNumber: '+639123456789',
        password: 'password123',
        name: 'Seller One',
        image: 'https://i.pravatar.cc/150?img=12',
        bio: "I'm selling stuff.",
      },
    })
    .catch(console.error);

  await auth.api
    .signUpEmail({
      body: {
        email: 'buyer@up.edu.ph',
        phoneNumber: '+63917123456789',
        password: 'password123',
        name: 'Buyer One',
        image: 'https://i.pravatar.cc/150?img=32',
        bio: "I'm buying stuff.",
      },
    })
    .catch(console.error);

  const seller = await prisma.user.findUniqueOrThrow({
    where: { email: 'seller@up.edu.ph' },
  });

  const buyer = await prisma.user.findUniqueOrThrow({
    where: { email: 'buyer@up.edu.ph' },
  });

  // CATEGORIES
  const electronics = await prisma.listingCategory.create({
    data: { categoryName: 'Electronics', slug: 'electronics' },
  });

  const books = await prisma.listingCategory.create({
    data: { categoryName: 'Books', slug: 'books' },
  });

  const furniture = await prisma.listingCategory.create({
    data: { categoryName: 'Furniture', slug: 'furniture' },
  });

  const accessories = await prisma.listingCategory.create({
    data: { categoryName: 'Accessories', slug: 'accessories' },
  });

  const clothing = await prisma.listingCategory.create({
    data: { categoryName: 'Clothing', slug: 'clothing' },
  });

  // LISTINGS
  const listings = await Promise.all([
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Mechanical Keyboard',
        description:
          'Barely used 75% mechanical keyboard with hot-swappable switches.',
        price: '2500.00',
        categoryId: electronics.id,
        condition: ListingCondition.LIKE_NEW,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'C Programming Language',
        description: 'Clean copy with minimal markings.',
        price: '1799.00',
        categoryId: books.id,
        condition: ListingCondition.GOOD,
        status: ListingStatus.SOLD,
        soldAt: now,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Study Desk',
        description: 'Wooden study desk, sturdy and minimal scratches.',
        price: '3200.00',
        categoryId: furniture.id,
        condition: ListingCondition.GOOD,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Wireless Headphones',
        description: 'Noise cancelling, good battery health.',
        price: '1800.00',
        categoryId: electronics.id,
        condition: ListingCondition.FAIR,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Laptop Backpack',
        description: 'Water-resistant backpack with laptop compartment.',
        price: '900.00',
        categoryId: accessories.id,
        condition: ListingCondition.LIKE_NEW,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Arduino Uno Kit',
        description: 'Complete starter kit for embedded projects.',
        price: '1200.00',
        categoryId: electronics.id,
        condition: ListingCondition.GOOD,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Python Crash Course Book',
        description: 'Beginner-friendly Python programming book.',
        price: '850.00',
        categoryId: books.id,
        condition: ListingCondition.LIKE_NEW,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Office Chair',
        description: 'Ergonomic chair with lumbar support.',
        price: '4500.00',
        categoryId: furniture.id,
        condition: ListingCondition.GOOD,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Gaming Mouse',
        description: 'RGB gaming mouse with adjustable DPI.',
        price: '950.00',
        categoryId: electronics.id,
        condition: ListingCondition.LIKE_NEW,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'USB-C Hub',
        description: 'Multiport adapter with HDMI and USB 3.0.',
        price: '1100.00',
        categoryId: electronics.id,
        condition: ListingCondition.GOOD,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Discrete Math Notes Compilation',
        description: 'Printed reviewer set for exams.',
        price: '300.00',
        categoryId: books.id,
        condition: ListingCondition.GOOD,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Graphic Hoodie',
        description: 'Cotton hoodie, slightly oversized.',
        price: '650.00',
        categoryId: clothing.id,
        condition: ListingCondition.GOOD,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Mechanical Pencil Set',
        description: '0.5mm drafting pencils with refills.',
        price: '250.00',
        categoryId: accessories.id,
        condition: ListingCondition.LIKE_NEW,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'LED Desk Lamp',
        description: 'Adjustable brightness with touch control.',
        price: '700.00',
        categoryId: furniture.id,
        condition: ListingCondition.GOOD,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'External SSD 512GB',
        description: 'Fast portable storage drive.',
        price: '2800.00',
        categoryId: electronics.id,
        condition: ListingCondition.LIKE_NEW,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Data Structures Book',
        description: 'Classic DS&A textbook.',
        price: '1500.00',
        categoryId: books.id,
        condition: ListingCondition.GOOD,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Whiteboard Set',
        description: 'Mini whiteboard with markers.',
        price: '400.00',
        categoryId: accessories.id,
        condition: ListingCondition.GOOD,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Monitor Stand',
        description: 'Metal adjustable monitor riser.',
        price: '950.00',
        categoryId: furniture.id,
        condition: ListingCondition.LIKE_NEW,
        status: ListingStatus.AVAILABLE,
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Smartphone Tripod',
        description: 'Flexible tripod for mobile photography.',
        price: '500.00',
        categoryId: electronics.id,
        condition: ListingCondition.GOOD,
        status: ListingStatus.AVAILABLE,
      },
    }),
  ]);

  // UPLOADS
  const uploads = await Promise.all(
    listings.map((_, i) =>
      createUpload(
        `https://picsum.photos/seed/listing-${i}/600/400`,
        `seed-listing-${i}-${Date.now()}`,
      ),
    ),
  );

  await prisma.listingImage.createMany({
    data: listings.map((l, i) => ({
      listingId: l.id,
      uploadId: uploads[i]!.id,
      sortOrder: 0,
    })),
  });

  // LIKED LISTING
  await prisma.likedListing.createMany({
    data: listings.slice(0, 5).map((l) => ({
      userId: buyer.id,
      listingId: l.id,
    })),
  });

  // CONVERSATION + MESSAGES
  await prisma.conversation.create({
    data: {
      listingId: listings[0].id,
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

  const transaction = await prisma.transaction.create({
    data: {
      listingId: listings[1].id,
      buyerId: buyer.id,
      sellerId: seller.id,
      agreedPrice: '1700.00',
      status: TransactionStatus.COMPLETED,
      completedAt: now,
    },
  });

  await prisma.review.createMany({
    data: [
      {
        reviewerId: buyer.id,
        revieweeId: seller.id,
        listingId: listings[1].id,
        transactionId: transaction.transactionId,
        rating: 5,
        comment: 'Smooth transaction and accurate listing.',
        role: ReviewRole.BUYER_TO_SELLER,
      },
      {
        reviewerId: seller.id,
        revieweeId: buyer.id,
        listingId: listings[1].id,
        transactionId: transaction.transactionId,
        rating: 5,
        comment: 'Fast payment and easy to deal with.',
        role: ReviewRole.SELLER_TO_BUYER,
      },
    ],
  });

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
        type: NotificationType.SYSTEM,
        title: 'Seed loaded',
        message: 'Demo data expanded with additional listings.',
      },
    ],
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
