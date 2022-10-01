const axios = require('axios')

module.exports = class Panel {
   api_url = 'https://www.gatenz-panel.com/api/'
   api_key = 'e04b97-a259c5-3a7743-b45c9c-d4f3c3'
   secret_key = 'cvyMgOXIUsnLZKD42pufA0dxzE6VWeCtkHQSRYb9Pmh3Jw1Bo5'

   paginator(items, page, per_page) {
      var page = page || 1,
         per_page = per_page || 10,
         offset = (page - 1) * per_page,
         paginatedItems = items.slice(offset).slice(0, per_page),
         total_pages = Math.ceil(items.length / per_page);
      return {
         page: page,
         per_page: per_page,
         pre_page: page - 1 ? page - 1 : null,
         next_page: (total_pages > page) ? page + 1 : null,
         total: items.length,
         total_pages: total_pages,
         data: paginatedItems
      }
   }

   layanan() {
      return new Promise(async resolve => {
         try {
            let form = new URLSearchParams
            form.append('api_key', this.api_key)
            form.append('action', 'services')
            const json = await (await axios.post(this.api_url, form)).data
            if (!json.status) return resolve({
               status: false
            })
            resolve({
               status: true,
               ...this.paginator(json.data, 3, 20)
            })
            require('fs').writeFileSync('./s.json', JSON.stringify(json, null, 3))
         } catch (e) {
            console.log(e)
            resolve({
               status: false
            })
         }
      })
   }

   order(id_service, data, quantity) {
      return new Promise(async resolve => {
         try {
            let form = new URLSearchParams
            form.append('api_key', this.api_key)
            form.append('action', 'order')
            form.append('secret_key', this.secret_key)
            form.append('service', id_service)
            form.append('data', data)
            form.append('quantity', quantity)
            const json = await (await axios.post(this.api_url, form)).data
            resolve(json)
         } catch (e) {
            console.log(e)
            resolve({
               status: false
            })
         }
      })
   }

   check(order_id) {
      return new Promise(async resolve => {
         try {
            let form = new URLSearchParams
            form.append('api_key', this.api_key)
            form.append('action', 'status')
            form.append('secret_key', this.secret_key)
            form.append('id', order_id)
            const json = await (await axios.post(this.api_url, form)).data
            resolve(json)
         } catch (e) {
            console.log(e)
            resolve({
               status: false
            })
         }
      })
   }

   profile() {
      return new Promise(async resolve => {
         try {
            let form = new URLSearchParams
            form.append('api_key', this.api_key)
            form.append('action', 'profile')
            const json = await (await axios.post(this.api_url, form)).data
            resolve(json)
         } catch (e) {
            console.log(e)
            resolve({
               status: false
            })
         }
      })
   }
}