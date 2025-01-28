import React from 'react'
import { Copy, CloudArrowDown, ArrowsClockwise } from 'phosphor-react'
import ProductIDInput from '../../components/ProductIDInput'
import VariantIDInput from '../../components/VariantIDInput'

export default {
  name: 'productVariant',
  title: 'Variant',
  type: 'object',
  fields: [
    {
      title: 'Display Title',
      name: 'title',
      type: 'string',
      description:
        'Shown where variant names appear (for example: Above the product title in the cart)',
    },
    {
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo',
    },
    {
      title: 'Product Title',
      name: 'productTitle',
      type: 'string',
    },
    {
      title: 'Variant Title',
      name: 'variantTitle',
      type: 'string',
    },
    {
      title: 'Product ID',
      name: 'productID',
      type: 'string',
      inputComponent: ProductIDInput,
    },
    {
      title: 'Variant ID',
      name: 'variantID',
      type: 'string',
      inputComponent: VariantIDInput,
    },
    {
      title: 'Compare Price (cents)',
      name: 'comparePrice',
      type: 'number',
    },
    {
      title: 'In Stock?',
      name: 'inStock',
      type: 'boolean',
    },
    {
      title: 'Low Stock?',
      name: 'lowStock',
      type: 'boolean',
    },
    {
      title: 'SKU',
      name: 'sku',
      type: 'string',
    },
    {
      title: 'Options',
      name: 'options',
      type: 'array',
      of: [{ type: 'productOptionValue' }],
    },
    {
      title: 'Draft Mode',
      name: 'isDraft',
      type: 'boolean',
      hidden: true,
    },
    {
      title: 'Deleted from Shopify?',
      name: 'wasDeleted',
      type: 'boolean',
      hidden: true,
    },
    {
      title: 'Colors',
      name: 'colors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'solidColor' }] }],
      validation: (Rule) => Rule.max(5).required(0),
    },
    {
      title: 'Price',
      name: 'price',
      type: 'number',
      validation: Rule => Rule.required().positive(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      variantTitle: 'variantTitle',
      productTitle: 'productTitle'
    },
    prepare({ title, variantTitle, productTitle = '(missing product)' }) {
      const getSubtitle = () => {
        if (title) {
          return title === variantTitle ? null : `(${variantTitle})`
        } else {
          return productTitle
        }
      }

      return {
        title: title ? title : variantTitle,
        subtitle: getSubtitle()
      }
    }
  }
}