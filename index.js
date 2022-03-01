const express = require('express')
const uuid = require('uuid')
const port = 3000
const server = express()

const orders =[]
server.use(express.json())



const checkUserId = (request, response, next) =>{
    const { id } = request.params 
  
    const index = orders.findIndex( order => order.id === id)
  
    if (index < 0) {
      return response.status(404).json( {error: "user not found"})
   } 
  
   request.orderIndex = index
   request.orderId = id
  
   next()
  
  }

  const routeAnUrl = (request, response, next) =>{
      const method = request.route.methods
      const url = request.route.path

      console.log(method,url)

      next()

  }



server.get('/orders', routeAnUrl, checkUserId,(request, response)=> {

   
    return response.json(orders) 
  })

server.get('/orders/:id', routeAnUrl, checkUserId,(request, response)=> {

  const index = request.orderIndex
   
    return response.json(orders[index]) 
  })

server.post('/orders', routeAnUrl, (request, response)=> {

    const { name, order, price, status } = request.body 

    const user = {id: uuid.v4(), name, order, price, status}

    orders.push(user)

  return response.status(201).json(user)
})


server.put('/orders/:id', routeAnUrl, checkUserId, (request, response)=> {
  
    const {name, order, price, status} = request.body
    const index = request.orderIndex
    const id = request.orderId
  
    const updatedUser = { id, name, order, price, status }
  
  
    orders[index] = updatedUser
     
   console.log(index)
      return response.json(updatedUser) 
 })


 server.patch('/orders/:id', routeAnUrl, checkUserId, (request, response)=>{

  const {name, order, price, status} = request.body
  const index = request.orderIndex
  const id = request.orderId

  const orderUpdate = { id, name, order, price, status }


  orders[index] = orderUpdate

  return response.json(orderUpdate) 
 })
  
 server.delete('/orders/:id', routeAnUrl, checkUserId, (request, response)=> {

    const index = request.orderIndex


    orders.splice(index,1)
   
    return response.status(204).json()
  })


server.listen(port, ()=> {
    console.log(`🚀 Server started on port ${port} `)
})