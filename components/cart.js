import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import FocusTrap from 'focus-trap-react'
import { m } from 'framer-motion'
import cx from 'classnames'
import { centsToPrice } from '@lib/helpers'
import {
  useSiteContext,
  useCartTotals,
  useCartCount,
  useCartItems,
  useToggleCart,
} from '@lib/context'
import CartItem from '@components/cart-item'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { CheckoutForm } from './stripe/checkout-form'
import { Input } from 'postcss'

const stripePromise = loadStripe(
  'pk_live_51PHY56IqbXyMSGmjfiHNgFGqrsy8kOM5RkNvKY62adXSjIVv5zSlP7QHE0xWVdacGRZ32bnvCnmaKqPo17ojDHdN00drHeJ6Ac'
)
//
const Cart = ({ data }) => {
  const { shop } = data
  const router = useRouter()

  if (!shop) return null

  const { isCartOpen, isUpdating } = useSiteContext()
  const { subTotal } = useCartTotals()
  const cartCount = useCartCount()
  const lineItems = useCartItems()
  const toggleCart = useToggleCart()

  const [hasFocus, setHasFocus] = useState(false)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    if (isCartOpen && subTotal > 0) {
      // Fetch the client secret from the server
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: subTotal }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret)
        })
    }
  }, [isCartOpen, subTotal])

  const handleKeyDown = (e) => {
    if (e.which === 27) {
      toggleCart(false)
    }
  }

  // const goToCheckout = (e) => {
  //   e.preventDefault();
  //   toggleCart(false);
  //   router.push('/checkout');
  // };

  const appearance = {
    theme: 'night',
    labels: 'floating',
    rules: {
      '.Tab': {
      },

      '.Tab:hover': {
      },

      '.Tab--selected': {
        backgroundColor: '#EA3680',
      },
      '.Input--floating': {
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      '.Label--floating': {
        color: '#CCCCC8',
        paddingLeft: '0px',
        fontSize: '12px',
      },
      '.Error': {
        paddingLeft: '16px',
      },
    },

    variables: {
      colorPrimary: '#000',
      colorBackground: '#1F1F1F',
      colorText: '#FFF',
      colorDanger: '#EA3680',
      colorBorder: '#F4F4F0',
      borderRadius: '24px',
      spacingUnit: '0px',
    },
  }

  return (
    <>
      <FocusTrap
        active={isCartOpen && hasFocus}
        focusTrapOptions={{ allowOutsideClick: true }}
      >
        <m.div
          initial="hide"
          animate={isCartOpen ? 'show' : 'hide'}
          variants={{
            show: {
              x: '0%',
            },
            hide: {
              x: '100%',
            },
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onKeyDown={(e) => handleKeyDown(e)}
          onAnimationComplete={(v) => setHasFocus(v === 'show')}
          className={cx('cart is-inverted', {
            'is-active': isCartOpen,
            'is-updating': isUpdating,
          })}
        >
          <div className="cart--inner">
            <div className="cart--content">
              <div className="cart--header">
                <div className="cart--title">
                  Your Cart <span className="cart--count">{cartCount}</span>
                </div>
                <button
                  className="cart-toggle"
                  onClick={() => toggleCart(false)}
                >
                  Done
                </button>
              </div>

              {lineItems?.length ? (
                <CartItems items={lineItems} />
              ) : (
                <EmptyCart />
              )}

              {lineItems?.length > 0 && (
                <div className="cart--footer">
                  <div className="cart--subtotal">
                    <span>Subtotal</span>
                    <span>${centsToPrice(subTotal)}</span>
                  </div>
                </div>
              )}

<div className="cart--checkoutform">
              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance,
                    shippingAddressRequired: true,
                    allowedShippingCountries: ['US'],
                    shippingRates: [
                      {
                        id: 'free-shipping',
                        displayName: 'Free shipping',
                        amount: 0,
                        deliveryEstimate: {
                         maximum: {unit: 'day', value: 7},
                         minimum: {unit: 'day', value: 5}
                        }
                      },
                    ]
          
                   }}
                >
                  <CheckoutForm />
                </Elements>
              )}
              </div>
              {/* <a
                  href="#"
                  onClick={(e) => goToCheckout(e)}
                  className="btn is-primary is-inverted is-large is-block"
                >
                  {isUpdating ? 'Updating...' : 'Checkout'}
                </a>

                {shop.cartMessage && (
                  <p className="cart--message">{shop.cartMessage}</p>
                )} */}
                          </div>
                          </div>
        </m.div>
      </FocusTrap>

      <div
        className={cx('cart--backdrop', {
          'is-active': isCartOpen,
        })}
        onClick={() => toggleCart(false)}
      />
    </>
  )
}

const CartItems = ({ items }) => {
  return (
    <div className="cart--items">
      {items.map((item) => {
        return <CartItem key={item.lineID} item={item} />
      })}
    </div>
  )
}

const EmptyCart = () => (
  <div className="cart--empty">
    <p>Your cart is empty</p>
  </div>
)

export default Cart
