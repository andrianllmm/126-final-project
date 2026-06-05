import 'dotenv/config';
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  PrismaClient,
  ListingCondition,
  ListingStatus,
  TransactionStatus,
  ReviewRole,
} from '../../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../../src/config/env.js';
import { auth } from '../../src/modules/auth/auth.config.js';

import { UploadsService } from '../../src/modules/uploads/uploads.service.js';
import { StorageProvider } from '../../src/modules/uploads/storage/storage.interface.js';
import { LocalStorageProvider } from '../../src/modules/uploads/storage/local.storage.js';
import { S3StorageProvider } from '../../src/modules/uploads/storage/s3.storage.js';

const adapter = new PrismaPg({
  connectionString: env.databaseUrl as string,
});

const prisma = new PrismaClient({ adapter });

const storageProvider: StorageProvider =
  env.uploadDriver === 's3'
    ? new S3StorageProvider()
    : new LocalStorageProvider();

const uploadsService = new UploadsService(prisma, storageProvider);

type ListingSeed = {
  title: string;
  description: string;
  price: string;
  categorySlug: string;
  condition: keyof typeof ListingCondition;
  status: keyof typeof ListingStatus;
  imageUrl: string;
};

function mustGet<T>(items: readonly T[], index: number, label: string): T {
  const item = items[index];
  if (item === undefined) throw new Error(`Missing ${label} at index ${index}`);
  return item;
}

function mustHave<T>(value: T | null | undefined, label: string): T {
  if (value === null || value === undefined) {
    throw new Error(`Missing ${label}`);
  }
  return value;
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function inferImageExtension(ref: string, mimeType: string): string {
  const mimeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
  };

  const fromMime = mimeMap[mimeType];
  if (fromMime) return fromMime;

  try {
    const ext = path.extname(new URL(ref).pathname);
    if (ext) return ext.replace('.', '');
  } catch {
    const ext = path.extname(ref);
    if (ext) return ext.replace('.', '');
  }

  return 'jpg';
}

async function clearUploadsDir() {
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  await fsp.rm(uploadsDir, { recursive: true, force: true });
  await fsp.mkdir(uploadsDir, { recursive: true });
}

async function uploadSeedImage(
  imageRef: string | undefined | null,
  seedKey: string,
  userId: string,
  listingsJsonDir: string,
) {
  if (!imageRef || typeof imageRef !== 'string') return null;

  const trimmed = imageRef.trim();
  if (!trimmed) return null;

  let buffer: Buffer;
  let mimeType: string | undefined;

  const isRemote = isValidUrl(trimmed);

  if (isRemote) {
    let response: Response;
    try {
      response = await fetch(trimmed, { redirect: 'follow' });
    } catch {
      return null;
    }

    if (!response.ok) return null;

    const contentType = response.headers.get('content-type');
    mimeType = contentType?.split(';')[0]?.trim().toLowerCase();

    if (!mimeType?.startsWith('image/')) return null;

    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer.byteLength) return null;

    buffer = Buffer.from(arrayBuffer);
  } else {
    const fullPath = path.resolve(listingsJsonDir, trimmed);

    try {
      buffer = await fsp.readFile(fullPath);
    } catch {
      return null;
    }

    const ext = path.extname(fullPath).replace('.', '').toLowerCase();

    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      avif: 'image/avif',
    };

    mimeType = mimeMap[ext] ?? 'image/jpeg';
  }

  const ext = inferImageExtension(trimmed, mimeType ?? 'image/jpeg');

  return uploadsService.upload(
    {
      buffer,
      originalname: `${seedKey}.${ext}`,
      mimetype: mimeType ?? 'image/jpeg',
      size: buffer.length,
    } as any,
    userId,
  );
}

async function main() {
  const now = new Date();

  await clearUploadsDir();

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
        image: 'https://i.pravatar.cc/150?img=5',
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

  const seedDir = path.dirname(fileURLToPath(import.meta.url));

  const categoriesPath = path.join(seedDir, 'data', 'categories.json');
  const categoriesRaw = await fsp.readFile(categoriesPath, 'utf-8');
  const categoriesParsed: unknown = JSON.parse(categoriesRaw);

  if (!Array.isArray(categoriesParsed)) {
    throw new Error('Invalid categories JSON format');
  }

  const categories = await Promise.all(
    (categoriesParsed as { categoryName: string; slug: string }[]).map((c) =>
      prisma.listingCategory.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
      }),
    ),
  );

  const categoryMap: Record<string, string> = {};
  for (const c of categories) categoryMap[c.slug] = c.id;

  const listingsPath = path.join(seedDir, 'data', 'listings.json');
  const listingsJsonDir = path.dirname(listingsPath);

  const raw = await fsp.readFile(listingsPath, 'utf-8');
  const parsed: unknown = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('Invalid listings JSON format');
  }

  const listingsSeed = parsed as ListingSeed[];

  const listings = await Promise.all(
    listingsSeed.map((l) => {
      const categoryId = mustHave(
        categoryMap[l.categorySlug],
        `category ${l.categorySlug}`,
      );

      return prisma.listing.create({
        data: {
          sellerId: seller.id,
          title: l.title,
          description: l.description,
          price: l.price,
          categoryId,
          condition: l.condition as ListingCondition,
          status: l.status as ListingStatus,
        },
      });
    }),
  );

  const uploads = await Promise.all(
    listingsSeed.map((l, i) =>
      uploadSeedImage(
        l.imageUrl,
        `seed-listing-${i}`,
        seller.id,
        listingsJsonDir,
      ),
    ),
  );

  await prisma.listingImage.createMany({
    data: listings
      .map((listing, i) => {
        const upload = uploads[i];
        if (!upload) return null;

        return {
          listingId: mustHave(listing.id, 'listing id'),
          uploadId: mustHave(upload.id, 'upload id'),
          sortOrder: 0,
        };
      })
      .filter(Boolean) as any,
  });

  const likedTargets = listings.slice(0, 5);

  await prisma.likedListing.createMany({
    data: likedTargets.map((l) => ({
      userId: buyer.id,
      listingId: mustHave(l.id, 'liked listing id'),
    })),
  });

  const first = mustGet(listings, 0, 'first listing');
  const second = mustGet(listings, 1, 'second listing');

  await prisma.conversation.create({
    data: {
      listingId: first.id,
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
      listingId: second.id,
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
        listingId: second.id,
        transactionId: transaction.transactionId!,
        rating: 5,
        comment: 'Smooth transaction and accurate listing.',
        role: ReviewRole.BUYER_TO_SELLER,
      },
      {
        reviewerId: seller.id,
        revieweeId: buyer.id,
        listingId: second.id,
        transactionId: transaction.transactionId!,
        rating: 5,
        comment: 'Fast payment and easy to deal with.',
        role: ReviewRole.SELLER_TO_BUYER,
      },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
