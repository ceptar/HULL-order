import React, { useEffect, useMemo } from 'react'
import Router from 'next/router'
import { ThemeProvider } from 'next-themes'
import { LazyMotion, domAnimation, AnimatePresence } from 'framer-motion'
import '../styles/fonts.css'
import '../styles/tailwind.css'
import '../styles/app.css'

import { isBrowser, useScrollRestoration } from '@lib/helpers'
import { pageTransitionSpeed } from '@lib/animate'

import {
  SiteContextProvider,
  useSiteContext,
  useTogglePageTransition,
} from '@lib/context'

import Cart from '@components/cart'

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_live_51PHY56IqbXyMSGmjfiHNgFGqrsy8kOM5RkNvKY62adXSjIVv5zSlP7QHE0xWVdacGRZ32bnvCnmaKqPo17ojDHdN00drHeJ6Ac');



const Site = ({ Component, pageProps, router }) => {
  const togglePageTransition = useTogglePageTransition()
  const { isPageTransition } = useSiteContext()

  const { data } = pageProps

  // Handle scroll position on history change
  useScrollRestoration(router, pageTransitionSpeed)

  // Trigger our loading class
  useEffect(() => {
    if (isBrowser) {
      document.documentElement.classList.toggle('is-loading', isPageTransition)
    }
  }, [isPageTransition])

  // Setup page transition loading states
  useEffect(() => {
    Router.events.on('routeChangeStart', (_, { shallow }) => {
      // Bail if we're just changing URL parameters
      if (shallow) return

      // Otherwise, start loading
      togglePageTransition(true)
    })

    Router.events.on('routeChangeComplete', () => {
      setTimeout(() => togglePageTransition(false), pageTransitionSpeed)
    })

    Router.events.on('routeChangeError', () => {
      togglePageTransition(false)
    })
  }, [])

  // intelligently add focus states if keyboard is used
  const handleFirstTab = (event) => {
    if (event.keyCode === 9) {
      if (isBrowser) {
        document.body.classList.add('is-tabbing')
        window.removeEventListener('keydown', handleFirstTab)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleFirstTab)
    return () => {
      window.removeEventListener('keydown', handleFirstTab)
    }
  }, [])

  const pageID = useMemo(() => data?.page?.id, [data])

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          document.body.classList.remove('overflow-hidden')
        }}
      >
        <Component key={pageID} {...pageProps} />
      </AnimatePresence>

      <Cart data={{ ...data?.site }} />
    </LazyMotion>
  )
}

// Site wrapped with Context Providers
const MyApp = ({ Component, pageProps, router }) => {
  const { data } = pageProps

  return (
    <ThemeProvider enableSystem={false} disableTransitionOnChange>
      <SiteContextProvider data={{ ...data?.site }}>
      <Elements stripe={stripePromise} 
      >
        <Site Component={Component} pageProps={pageProps} router={router} />
        </Elements>
      </SiteContextProvider>
    </ThemeProvider>
  )
}

export default MyApp
