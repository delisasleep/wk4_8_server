import express from "express";
import mysql from "mysql2";
import cors from "cors"; 

const server = new express();

server.use(express.json());
server.use(cors());


const port = 4503;
server.listen(port, () => {
    console.log("ITS ALIVEEE!!", "#", port)
});

server.get('/test',(req, res) => {
    res.json({message:"test!"});
})

//Database Connection Setup//
const db = mysql.createPool(
    {
        host: "localhost",
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'miraclesdb'
    }
);
db.getConnection((error) => {
    if(error){
        console.log(error);
    }
    else{
        console.log('Linked to DB!! YAYYYY!!!');
    }
});  


//Miracles CRUD Operations//
// GET/READ- For displaying products on the client AND admin side//
server.get('/products', (req,res) => {
let sqlQuery = 'CALL GetAllProducts()';
db.query(sqlQuery, (error, data) => {
    if(error){
        res.json(error);
    }
    if(data){
        res.json(data[0]);
    }
})
})

//POST/CREATE- For adding new products to the database//
server.post('/products', (req,res) => {
    let sqlQuery = 'CALL AddProduct(?, ?, ?, ?, ?, ?)'
    let prodTitle = req.body.title;
    let prodDesc = req.body.description;
    let prodPrice = req.body.storeprice;
    let prodRetail = req.body.retailprice;
    let prodOccasion = req.body.occasion;
    let prodStatus = req.body.is_online;
    db.query(sqlQuery, [prodTitle, prodDesc, prodPrice, prodRetail, prodOccasion, prodStatus], (error, data) => {
        if(error){
            res.json(error);
        }
        if(data){
            res.json({ ...data[0][0], success: true, message: "Product added successfully!" });
        }
    })
})

// PUT/UPDATE- For updating existing products in the database//
server.put("/products/:id", function(req, res) {
    // 1. Map your Product Management fields
    let sqlQuery = 'CALL `UpdateProducts`(?, ?, ?, ?, ?, ?, ?)'; 
    let id = req.params.id;
    let prodTitle = req.body.title || null;
    let prodDesc = req.body.description || null;
    let prodPrice = req.body.storeprice || null;
    let prodRetail = req.body.retailprice || null;
    let prodOccasion = req.body.occasion || null;
    let prodStatus = req.body.is_online || null;

    db.query(sqlQuery, [id, prodTitle, prodDesc, prodPrice, prodRetail, prodOccasion, prodStatus], (error, data) => {
        if (error) {
            // Return error if SQL fails
            return res.status(500).json(error);
        }
        if (data) {
            res.json({ success: true, message: "Product updated!! YAY!", product: data[0][0] });
        }
    });
});

// DELETE- For deleting products from the database//
// DELETE
server.delete('/products/:id', (req, res) => {
    let sqlquery = 'CALL DeleteProductwReceipt(?)';
    let productID = req.params.id; // params calls to the :id that you set above, but can be custom to anything you add there

    db.query(sqlquery, [productID], (error, data) => {
        if(error){
        res.json(error);
      }  

      if(data){
        res.json(data[0][0]) ;
      }
    })

})