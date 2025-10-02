import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma.service';
import { isULID, isUUID } from 'validator';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  getDashboardData = async (
    userId: string | undefined,
    type: 'AP' | 'HOUSE' | 'LAND' | undefined,
    filterBy: string | null,
    search: string | UUID | undefined,
    pageOffset: string,
    isActive: string,
  ) => {
    try {
      let postIsActive;

      const convertIsActive = () => {
        if (isActive === undefined) postIsActive = undefined;
        if (isActive === 'active') postIsActive = true;
        if (isActive === 'archived') postIsActive = false;
      };

      convertIsActive();

      if (search !== undefined && isUUID(search)) {
        const data = await this.prisma.imovel.findFirst({
          where: {
            userId,
            id: search,
          },
          select: {
            id: true,
            title: true,
            price: true,
            street: true,
            log: true,
            city: true,
            type: true,
            estate: true,
            isActive: true,
            CEP: true,
            userId: true,
          },
        });
        return {
          pagination: {
            totalCount: 1,
            pages: 0,
          },
          data: [data],
        };
      }

      if (search !== undefined) {
        return await this.getAdBySearch(
          search,
          type,
          filterBy,
          userId,
          postIsActive,
          pageOffset,
        );
      }

      const orderBy: {}[] = [];

      switch (true) {
        case filterBy === 'createdAt':
          orderBy.push({ postedAt: 'desc' });
          break;
        case filterBy === 'priceDesc':
          orderBy.push({ price: 'desc' });
        case filterBy === 'priceAsc':
          orderBy.push({ price: 'asc' });
        default:
      }

      const totalCount = await this.prisma.imovel.count({
        where: {
          userId,
          type: type ? type : undefined,
          isActive: postIsActive ?? undefined,
        },
      });

      const itemsPerPage = 10;
      const totalPages = Math.ceil(totalCount / itemsPerPage);

      const offsetCalc = (parseInt(pageOffset) - 1) * 10;


      const data = await this.prisma.imovel.findMany({
        where: {
          userId,
          type: type ? type : undefined,
          isActive: postIsActive ?? undefined,
        },
      
        skip: offsetCalc ?? 0,
        take: 10,
        orderBy: orderBy.length > 0 ? orderBy : undefined,
        select: {
          id: true,
          title: true,
          price: true,
          street: true,
          log: true,
          city: true,
          type: true,
          estate: true,
          isActive: true,
          CEP: true,
          userId: true,
        },
         
      });

      return {
        pagination: {
          totalCount: totalCount,
          pages: totalPages,
        },
        data: data,
      };
    } catch (err) {
      throw err;
    }
  };

  async getAdBySearch(
    searchTerm: string,
    type: string | undefined,
    filterBy: string | null,
    userId: string | undefined,
    isActive: boolean | undefined,
    pageOffset: string,
  ) {
    const formatedQuery = searchTerm
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => `${word}:*`)
      .join(' | ');

    const visibilityQuery =
      typeof isActive === 'boolean'
        ? Prisma.sql` AND "isActive" = ${isActive}`
        : Prisma.sql``;

    const pageQuery = await this.prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM imovel
      WHERE "userId" = ${userId} ${visibilityQuery} AND to_tsvector('portuguese', title) @@ to_tsquery('portuguese', ${formatedQuery})
`;

    const totalCount = Number(pageQuery[0].count);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const offset = (parseInt(pageOffset) - 1) * 10;
    const baseQuery = Prisma.sql`
    SELECT id, title, price, street, log, city, type, estate, "isActive", "CEP", "userId",
           ts_rank(
             to_tsvector('portuguese', title),
             to_tsquery('portuguese', ${formatedQuery})
           ) AS rank
           
    FROM "imovel" 
    
    WHERE "userId" = ${userId}  ${visibilityQuery} AND to_tsvector('portuguese', title) @@ to_tsquery('portuguese', ${formatedQuery})
   
  `;

    const allowedTypes = ['AP', 'HOUSE', 'LAND'];
    const typeCondition =
      type && type.trim() !== '' && allowedTypes.includes(type)
        ? Prisma.sql`AND type = ${Prisma.raw(`'${type}'::"PropertyType"`)}`
        : Prisma.empty;

    let orderAndLimit: any;

    switch (filterBy) {
      case 'createdAt':
        orderAndLimit = Prisma.sql`ORDER BY "postedAt" DESC LIMIT 10 OFFSET  ${offset}`;
        break;
      case 'priceDesc':
        orderAndLimit = Prisma.sql`ORDER BY price DESC LIMIT 10  OFFSET  ${offset}`;
        break;
      case 'priceAsc':
        orderAndLimit = Prisma.sql`ORDER BY price ASC LIMIT 10  OFFSET  ${offset}`;
        break;
      default:
        orderAndLimit = Prisma.sql`ORDER BY rank DESC LIMIT 10  OFFSET  ${offset}`;
    }

    const query = Prisma.sql`${baseQuery} ${typeCondition} ${orderAndLimit}`;

    const data = await this.prisma.$queryRaw(query);

    return {
      pagination: {
        totalCount: totalCount,
        pages: totalPages,
      },
      data: data,
    };
  }

  async getDashboardPostDataById(postId: string, userId: string) {
    const post = await this.prisma.imovel.findFirst({
      where: {
        userId: userId,
        id: postId,
      },
      include: {
        imovelImages: true,
<<<<<<< HEAD
        user: {
          select: {
            id: true, 
            email: true,
            firstName:true,
            lastName:true,
            createdAt:true
          },
        },
=======
        user:true
>>>>>>> b3f996cc52563456d60bd3a060f86a2e73991751
      },
    });

    if (!post) throw new NotFoundException();

    return post;
  }
}
