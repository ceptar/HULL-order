import { hasObject } from '@lib/helpers'
import React, { useState } from 'react'

import {
  ProductCounter,
  ProductAdd,
  ProductWaitlist,
} from '@components/product'

const ProductActions = ({ activeVariant, klaviyoAccountID, product, productAddPhotos }) => {
  // set default quantity
  const [quantity, setQuantity] = useState(1)

    const defaultPhoto = productAddPhotos?.find((set) => !set.forOption)
    const variantPhoto = productAddPhotos?.find((set) => {
      const option = set.forOption
        ? {
            name: set.forOption.split(':')[0],
            value: set.forOption.split(':')[1],
          }
        : {}
      return option.value && hasObject(activeVariant.options, option)
    })
  
    const addPhotos = variantPhoto ? variantPhoto : defaultPhoto

    return (
    <div className="product--actions">
      {activeVariant?.inStock ? (
        <>
          <ProductCounter
            id={activeVariant.id}
            max={10}
            onUpdate={setQuantity}
          />
          <ProductAdd
            productID={activeVariant.id}
            quantity={quantity}
            price={activeVariant.price}
            className="btn is-primary is-large is-block"
            productTitle={activeVariant.title}
            productSubTitle={product.title}
            productSlug={product.slug}
            options={activeVariant.options}
            photo={addPhotos.photos[0]}
          >
            Add To Cart
          </ProductAdd>
        </>
      ) : (
        <>
          {klaviyoAccountID ? (
            <ProductWaitlist
              variant={activeVariant.id}
              klaviyo={klaviyoAccountID}
            />
          ) : (
            <div className="btn is-large is-disabled is-block">
              Out of Stock
            </div>
          )}
        </>
      )}
    </div>
  )
}
export default ProductActions