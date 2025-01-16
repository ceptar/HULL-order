import React, { createContext, useContext, useEffect, useState } from 'react'
import { Base64 } from 'base64-string'
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
const stripePromise = loadStripe('pk_live_51PHY56IqbXyMSGmjfiHNgFGqrsy8kOM5RkNvKY62adXSjIVv5zSlP7QHE0xWVdacGRZ32bnvCnmaKqPo17ojDHdN00drHeJ6Ac')

// get our API clients (shopify + sanity)
import { getSanityClient } from '@lib/sanity'

// get our global image GROQ
import { queries } from '@data'

// Set our initial context states
const initialContext = {
  isPageTransition: false,
  meganav: {
    isOpen: false,
    activeID: null,
  },
  productCounts: [],
  isLoading: true,
  isAdding: false,
  isUpdating: false,
  isCartOpen: false,
  checkout: {
    id: null,
    lineItems: [],
  },
}

// Set context
const SiteContext = createContext({
  context: initialContext,
  setContext: () => null,
})

// Set our checkout states
const setCheckoutState = (lineItems, setContext, openCart) => {
  const subTotal = lineItems.reduce((total, item) => total + item.price * item.quantity, 0)
  setContext((prevState) => ({
    ...prevState,
    isAdding: false,
    isLoading: false,
    isUpdating: false,
    isCartOpen: openCart ? true : prevState.isCartOpen,
    checkout: {
      ...prevState.checkout,
      lineItems,
      subTotal,
    },
  }))
  localStorage.setItem('cart', JSON.stringify(lineItems))
}

/*  ------------------------------ */
/*  Our Context Wrapper
/*  ------------------------------ */

const SiteContextProvider = ({ data, children }) => {
  const { productCounts } = data

  const [context, setContext] = useState({
    ...initialContext,
    ...{ productCounts },
  })

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || []
    setCheckoutState(storedCart, setContext, false)
  }, [])

  return (
    <SiteContext.Provider value={{ context, setContext }}>
      {children}
    </SiteContext.Provider>
  )
}

// Access our global store states
function useSiteContext() {
  const { context } = useContext(SiteContext)
  return context
}

// Toggle page transition state
function useTogglePageTransition() {
  const {
    context: { isPageTransition },
    setContext,
  } = useContext(SiteContext)

  async function togglePageTransition(state) {
    setContext((prevState) => {
      return { ...prevState, isPageTransition: state }
    })
  }
  return togglePageTransition
}

// Toggle Mega Navigation states
function useToggleMegaNav() {
  const {
    context: { meganav },
    setContext,
  } = useContext(SiteContext)

  async function toggleMegaNav(state, id = null) {
    setContext((prevState) => {
      return {
        ...prevState,
        meganav: {
          isOpen: state === 'toggle' ? !meganav.isOpen : state,
          activeID: state === 'toggle' && meganav.isOpen ? null : id,
        },
      }
    })
  }
  return toggleMegaNav
}

/*  ------------------------------ */
/*  Our Shopify context helpers
/*  ------------------------------ */

// Access our cart item count
function useCartCount() {
  const {
    context: { checkout },
  } = useContext(SiteContext)

  let count = 0

  if (checkout.lineItems) {
    count = checkout.lineItems.reduce((total, item) => item.quantity + total, 0)
  }

  return count
}

// Access our cart totals
function useCartTotals() {
  const {
    context: { checkout },
  } = useContext(SiteContext)

  const subTotal = checkout.subTotal ? checkout.subTotal : 0
  return {
    subTotal,
  }
}

// Access our cart items
function useCartItems() {
  const {
    context: { checkout },
  } = useContext(SiteContext)

  return checkout.lineItems
}

// Add an item to the cart
function useAddItem() {
  const { context, setContext } = useContext(SiteContext)

  const addItem = (productID, quantity, price, productTitle, productSubTitle, productSlug, options, photo) => {

    const existingItem = context.checkout.lineItems.find(item => item.id)
    const newLineItems = existingItem
      ? context.checkout.lineItems.map(item =>
          item.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      : [...context.checkout.lineItems, {
          id: context.checkout.id,
          lineID: productID,
          product: { id: productID, title: productTitle, slug: productSlug },
          title: productTitle,
          subTitle: productSubTitle,
          price,
          quantity,
          options,
          photo,
        }]

    setCheckoutState(newLineItems, setContext, true)
  }

  return addItem
}

// Update item in cart
function useUpdateItem() {
  const { context, setContext } = useContext(SiteContext)

  const updateItem = (productID, quantity) => {

    const newLineItems = context.checkout.lineItems.map(item =>
      item.product.id !== productID? { ...item, quantity } : item
    )

    setCheckoutState(newLineItems, setContext)
  }

  return updateItem
}

// Remove item from cart
function useRemoveItem() {
  const { context, setContext } = useContext(SiteContext)

  const removeItem = (productID) => {
    const newLineItems = context.checkout.lineItems.filter(item => item.product.id !== productID)

    setCheckoutState(newLineItems, setContext)
  }

  return removeItem
}

// Create Stripe checkout session
function useCheckout() {
  const { context } = useContext(SiteContext)

  const createCheckoutSession = async () => {
    const stripe = await stripePromise
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: context.checkout.lineItems }),
    })
    const session = await response.json()
    await stripe.redirectToCheckout({ sessionId: session.id })
  }

  return createCheckoutSession
}

// Toggle cart state
function useToggleCart() {
  const { context, setContext } = useContext(SiteContext)

  const toggleCart = () => {
    setContext((prevState) => ({
      ...prevState,
      isCartOpen: !context.isCartOpen,
    }))
  }

  return toggleCart
}

// Reference a collection product count
function useProductCount() {
  const {
    context: { productCounts },
  } = useContext(SiteContext)

  function productCount(collection) {
    const collectionItem = productCounts.find((c) => c.slug === collection)
    return collectionItem.count
  }

  return productCount
}

export {
  SiteContextProvider,
  useSiteContext,
  useTogglePageTransition,
  useToggleMegaNav,
  useCartCount,
  useCartTotals,
  useCartItems,
  useAddItem,
  useUpdateItem,
  useRemoveItem,
  useCheckout,
  useToggleCart,
  useProductCount,
}
