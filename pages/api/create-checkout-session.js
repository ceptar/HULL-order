// import Stripe from 'stripe'
// import imageUrlBuilder from '@sanity/image-url'
// import sanityClient from '@lib/sanity'


// const builder = imageUrlBuilder(sanityClient)

// const urlFor = source => {
//   return builder.image(source).url()
// }

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// export default async (req, res) => {
//   const { items } = req.body

//   const session = await stripe.checkout.sessions.create({
//     line_items: items.map((item) => {
//       const photo = item.photos && item.photos.length > 0 ? item.photos[0] : null
//       const imageUrl = photo ? urlFor(photo.asset._ref) : undefined
//       return {   
//       price_data: {
//         currency: "usd",
//         unit_amount: item.price * 1,
//         product_data: {
//           name: item.product.title || "Unnamed product",
//           description: `Variant ID: ${item.product.id}`,
//           images: imageUrl ? [imageUrl] : [],
//         },
//       },
//       quantity: item.quantity,
//     }}),
//     payment_method_types: ['card'],
//     mode: 'payment',
//     success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${req.headers.origin}/cancel`,
//   })

//   res.status(200).json({ id: session.id })
// }