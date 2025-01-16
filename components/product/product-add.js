import React from 'react'
import cx from 'classnames'

import { useSiteContext, useAddItem } from '@lib/context'

const ProductAdd = ({ productID, quantity = 1, price, className, children, productTitle, productSubTitle, productSlug, options, photo }) => {
  const addItemToCart = useAddItem()
  const { isLoading, isAdding } = useSiteContext()
console.log('photo', photo)
  return (
    <>
      {isLoading ? (
        <button className={cx('is-disabled', className)} disabled>
          Loading...
        </button>
      ) : (
        <button
          className={cx(className, { 'is-disabled': isAdding })}
          onClick={() => addItemToCart(productID, quantity, price, productTitle, productSubTitle, productSlug, options, photo)}
        >
          {isAdding ? 'Adding...' : <>{children ? children : 'Add to Cart'}</>}
        </button>
      )}
    </>
  )
}

export default ProductAdd