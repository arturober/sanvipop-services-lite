import { QueryOrder, QBFilterQuery, QueryOrderMap } from "@mikro-orm/core";
import { EntityRepository } from "@mikro-orm/knex";
import { Product } from "src/entities/Product";

export class ProductsRepository extends EntityRepository<Product> {
    public findByDistance(
        lat = 0, 
        lng = 0, 
        idLogged = 1,
        where: QBFilterQuery<Product> = { $not: { status: 3 } },
        orderBy: QueryOrderMap<Product> = {'id': QueryOrder.ASC},
        joins: Map<string, any> = null
    ): Promise<Product[]> {
        let qb = this.em.createQueryBuilder(Product, 'p').select([
                'p.*', 
                't.idProduct as rating',
                `haversine(u.lat, u.lng, ${lat}, ${lng}) AS distance`, 
                `exists(SELECT 1 FROM product_bookmark pb WHERE pb.iduser = ${idLogged} AND pb.idProduct = p.id) AS bookmarked`
            ])
            .join('p.owner', 'u')
            .join('p.rating', 't', undefined, 'leftJoin');

        if(where) {
            qb = qb.where(where);
        }

        if(joins) {
            console.log(joins);
            for(const join of joins.keys()) {
                qb = qb.join('p.' + join, join, joins.get(join));
            }
        }

        if(orderBy) {
            qb = qb.orderBy(orderBy);
        }
            
        return qb.getResult();
    }

    public findById(idProduct: number, idLogged: number, lat = 0, lng = 0,): Promise<Product> {
        return this.em.createQueryBuilder(Product, 'p').select([
            'p.*',
            `haversine(u.lat, u.lng, ${lat}, ${lng}) AS distance`, 
            `exists(SELECT 1 FROM product_bookmark pb WHERE pb.iduser = ${idLogged} AND pb.idProduct = p.id) AS bookmarked`
        ])
        .join('p.owner', 'u')
        .where({ id: idProduct })
        .getSingleResult();
    }
}