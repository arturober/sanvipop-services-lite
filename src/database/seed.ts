import { MikroORM } from '@mikro-orm/sql';
import config from '../config/database.config.js';
import { Category } from '../modules/categories/entities/category.entity.js';
import { Product, ProductStatus } from '../modules/products/entities/product.entity.js';
import { ProductPhoto } from '../modules/products/entities/product-photo.entity.js';

async function runSeed() {
  const orm = await MikroORM.init({
    ...config,
    debug: false,
  });

  try {
    const generator = orm.schema;
    await generator.drop();
    await generator.create();

    const em = orm.em.fork();

    await em.transactional(async (forkEm) => {
      // 1. Categorías oficiales
      const categoriesData = [
        { id: 1, name: 'Informática' },
        { id: 2, name: 'Telefonía' },
        { id: 3, name: 'Hogar' },
        { id: 4, name: 'Deportes' },
        { id: 5, name: 'Motor' },
        { id: 6, name: 'Moda' },
        { id: 7, name: 'Juegos' },
        { id: 8, name: 'Otros' },
      ];
      const categories = categoriesData.map((cat) => forkEm.create(Category, cat));

      // 2. Productos de ejemplo
      const p1 = forkEm.create(Product, {
        title: 'Bicicleta de montaña Rockrider',
        description:
          'Bicicleta de montaña en perfecto estado, talla M, ruedas 29 pulgadas, frenos de disco hidráulicos.',
        price: 150.0,
        category: categories[3], // Deportes
        status: ProductStatus.AVAILABLE,
        numVisits: 24,
      });

      const p2 = forkEm.create(Product, {
        title: 'iPhone 13 Pro 128GB',
        description:
          'iPhone 13 Pro color azul grafito, 128GB, pantalla intacta, salud de batería al 87%. Incluye caja original.',
        price: 450.0,
        category: categories[1], // Telefonía
        status: ProductStatus.AVAILABLE,
        numVisits: 68,
      });

      const p3 = forkEm.create(Product, {
        title: 'Portátil Lenovo ThinkPad T14',
        description:
          'Intel Core i5, 16GB RAM, 512GB SSD NVMe, pantalla 14 pulgadas FHD. Perfecto para programación o teletrabajo.',
        price: 380.0,
        category: categories[0], // Informática
        status: ProductStatus.AVAILABLE,
        numVisits: 45,
      });

      const p4 = forkEm.create(Product, {
        title: 'Sofá chaise longue gris',
        description:
          'Sofá chaise longue de 3 plazas, tela antimanchas color gris marengo, asientos deslizantes y reclinables.',
        price: 200.0,
        category: categories[2], // Hogar
        status: ProductStatus.AVAILABLE,
        numVisits: 15,
      });

      const p5 = forkEm.create(Product, {
        title: 'Nintendo Switch OLED',
        description:
          'Nintendo Switch modelo OLED blanca, muy poco uso. Incluye cable HDMI, adaptador de corriente y juego Mario Kart 8 Deluxe.',
        price: 220.0,
        category: categories[6], // Juegos
        status: ProductStatus.AVAILABLE,
        numVisits: 52,
      });

      const p6 = forkEm.create(Product, {
        title: 'Casco de moto MT Helmets',
        description:
          'Casco integral MT Helmets talla L, diseño negro mate, visera transparente anti-vaho y pantalla solar integrada.',
        price: 65.0,
        category: categories[4], // Motor
        status: ProductStatus.AVAILABLE,
        numVisits: 9,
      });

      const p7 = forkEm.create(Product, {
        title: 'Chaqueta de cuero vintage',
        description:
          'Chaqueta de cuero auténtico estilo motero, color marrón envejecido, talla L. Forro interior abrigado y en perfecto estado.',
        price: 45.0,
        category: categories[5], // Moda
        status: ProductStatus.AVAILABLE,
        numVisits: 18,
      });

      const p8 = forkEm.create(Product, {
        title: 'Monitor Gaming 27 pulgadas 144Hz',
        description:
          'Monitor IPS 27" 144Hz 1ms, resolución 1080p, soporte regulable en altura, puertos HDMI y DisplayPort.',
        price: 130.0,
        category: categories[0], // Informática
        status: ProductStatus.AVAILABLE,
        numVisits: 31,
      });

      // 3. Fotos de productos y foto principal
      const products = [p1, p2, p3, p4, p5, p6, p7, p8];
      products.forEach((prod, index) => {
        const photo = forkEm.create(ProductPhoto, {
          url: `img/products/product-${index + 1}.jpg`,
          product: prod,
        });
        prod.mainPhoto = photo;
        prod.photos.add(photo);
      });
    });

    console.log('✅ Base de datos sembrada correctamente.');
    console.log('--------------------------------------------------');
    console.log('Productos y categorías disponibles sin dependencia de usuarios.');
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('❌ Error al sembrar la base de datos:', error);
    process.exit(1);
  } finally {
    await orm.close();
  }
}

runSeed();
