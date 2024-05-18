const express = require("express")
const port = 3000
const app = express()
const uuid =  require("uuid")


app.use(express.json());

const users =  [];


const check = (request, response, next) => {
    const {id} = request.params;
    const order = users.find(order => order.id === id);

    if(!order) {
        return response.status(404).json({mensagem: "pedido não encontado"})
    }
    request.order = order
    next()
}

const checkOne = (request, response, next) => {
        console.log(`metodo: ${request.method}, url: ${request.url}`)
        next()


}

app.use(checkOne);





app.get("/orders", (request, response) => {
    return response.status(200).json(users)
})




app.post("/order",  (request,response) => {
    const {order, cliente, preço} = request.body

     const id = uuid.v4();
     const status = "em preparaçao";
     const client = {id, order, cliente, preço, status};
     users.push(client);
     return response.status(201).json(client);

 
});


app.put("/order/:id", check, (request,response) =>{
   const {order, cliente, preço} = request.body;

    request.order.order = order || request.order.order;
    request.order.cliente = cliente || request.order.cliente;
    request.order.preço = preço || request.order.preço;
   

    return response.status(200).json(request.order);
});


app.delete("/order/:id", check, (request, response) => {
   
      const index = users.findIndex(order => order.id === request.order.id);
      if(index === -1){
        return response.status(404).json({mensagem: "usuario nao encontrado"})
      }

      users.splice(index, 1);
    return response.status(204).send();
});



app.get("/order/:id", check, (request, response) => {
   return response.status(200).json(request.order);
});



app.patch("/order/:id", check, (request, response) => {
    request.order.status = "pronto";
    return response.status(200).json(request.order);
});




app.listen(port, () => {
    console.log(`😁 serve started on port ${port}`)
})