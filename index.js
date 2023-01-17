const sanityClient = require('@sanity/client')
const client = sanityClient({
  projectId: 'kzfz2ho3',
  dataset: 'production',
  apiVersion: '2021-03-25', // use current UTC date - see "specifying API version"!
  token: process.env.SANITY_TOKEN, // or leave blank for unauthenticated usage
  useCdn: false, // `false` if you want to ensure fresh data
})

// Prevents rate limiting, could fix later with async/await timeouts
const limit = 50
const query = `*[_type == "dealer" && ("elitearchery.com" in domains[]->url) && !("askforelite.com" in domains[]->url)]`
const params = {}

async function updateItems(){
	const items = await asyncFetch(query, params)
	console.log(`Found ${items.length} items...`)
	process.exit(0)
	for(let i = 0; i < items.length; i++){
		console.log(`Updating item: ${items[i].name} ...`)

		// Add to item array
		items[i].domains.push({
			// Generate random ID
			_key: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
			_ref: '03f88236-8a17-4f14-a7db-6013fc2ab112',
			_type: 'reference'
		})

		// Update item
		await client.patch(items[i]._id).set(items[i]).commit()
			.catch((err) => {
				console.error(err)
				process.exit(1)
			})
		console.log('Updated item: ', items[i].name)
	}
}
updateItems()

function asyncFetch(query, params){
	return new Promise((resolve, reject) => {
		client.fetch(query, params).then((res) => {
			resolve(res)
		})
		.catch((err) => {
			reject(err)
		})
	})
}



// client.fetch(query, params).then((items) => {
// 	console.log(`Found ${res.length} items...`)
// 	res.forEach((item) => {
// 		 console.log(`Updating item: ${item.name} ...`)
 
// 		 // Add to item array
// 		 item.domains.push({
// 			 // Generate random ID
// 			 _key: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
// 			 _ref: '03f88236-8a17-4f14-a7db-6013fc2ab112',
// 			 _type: 'reference'
// 		 })
 
// 		 // Update item
// 		 client.patch(item._id).set(item).commit().then((res) => {
// 				 console.log('Updated item: ', res.name)
// 			 })
// 			 .catch((err) => {
// 				 console.error(err)
// 				 process.exit(1)
// 			 })
 
 
// 	})
 
//  })
 