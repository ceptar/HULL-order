import S from '@sanity/desk-tool/structure-builder'
import sanityClient from 'part:@sanity/base/client'
import { order } from '../schemas/order';

const Orders = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Products')
        .id('product')
        .child(S.documentTypeList('product').title('Product')),
      S.listItem()
        .title('Orders')
        .id('order')
        .child(
          S.documentTypeList(order).title('Order')
        ),
    ]);

export default structure;