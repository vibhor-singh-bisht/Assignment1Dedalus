const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("./public"));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

const filePath = path.join(__dirname, 'data', 'shirts.json');
const fileData = fs.readFileSync(filePath);
const availableShirts = JSON.parse(fileData);

let cartItems = []; 
   
//     for( let x of availableitems){
//         if(x[id]===id){
//             const objectValues=Object.values(availableitems);
//             const tobedeletedIndex=objectValues.indexOf(x[id]);
//             availableitems.splice(tobedeletedIndex,1);
//         }
//     }
// }
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/shop', function (req, res) {
    res.render('shop', { numberOfItems: availableShirts.length, shirts: availableShirts });
});
app.get('/contact',function(req,res){
    res.render('contact');
})
app.get('/user', function (req, res) {
    res.render('user');
});

app.get('/cart', function (req, res) {
    const filePath = path.join(__dirname, 'data', 'cart.json');
    const fileData = fs.readFileSync(filePath);
    const availableitems = JSON.parse(fileData);
    res.render('cart', { cartLength: availableitems.length, cartItems: availableitems });
});


// app.post('/addToCart', function (req, res) {
    //     const data = req.body;
    //     // const id=req.body.id;
    //     // const name=req.body.name;
    //     // const price=req.body.price;
    //     // addToCart({_id,name,price});
    //     // res.render('/cart',{cartItems:cartItems}); 
    
    //     const filePath = path.join(__dirname, 'data', 'cart.json');
    //     const fileData = fs.readFileSync(filePath);
    //     const availableitems = JSON.parse(fileData);
    //     console.log(data);
    //     availableitems.push(data);
    //     fs.writeFileSync(filePath,JSON.stringify(availableitems));
    //     // res.redirect('/cart'); // Redirect to cart page after adding item to cart
    //     res.render('cart', {nlength:availableitems.length, shirts: availableitems });
    // });
    // app.post('/sendtocheckout',function(req,res){
        //     console.log("This block is running");
        //     // const data = req.body;
        //     res.render('checkout');
        
        // })

        app.post('/addToCart', function (req, res) {
            const data = req.body;
            const filePath = path.join(__dirname, 'data', 'cart.json');
            const fileData = fs.readFileSync(filePath);
            const availableitems = JSON.parse(fileData);
            console.log(data);
            availableitems.push(data);
            fs.writeFileSync(filePath, JSON.stringify(availableitems));
            res.render('cart', { cartLength: availableitems.length, cartItems: availableitems });
        });

        app.post('/deleteshirt',function(req,res){
            const shirttobedeleted=req.body.id;
            console.log("id ",shirttobedeleted); 
            const filePath = path.join(__dirname, 'data', 'cart.json');
            const fileData = fs.readFileSync(filePath);
            const availableitems = JSON.parse(fileData);
            const con=availableitems.find(obj=>obj.id===shirttobedeleted);
            const index=availableitems.findIndex(obj=>obj.id===shirttobedeleted);
            if(con){
                availableitems.splice(index,1);
                console.log("After Splice ",availableitems);
                // availableitems.push(con);
                fs.writeFileSync(filePath,JSON.stringify(availableitems));
                console.log(availableitems);
                
            }
            res.render('cart', {cartLength:availableitems.length, cartItems:availableitems });
            
        });

        app.get('/completeorder',function(req,res){
            res.redirect('approvePayment');  //On the checkout form leads to payment pending page
        });
        
        app.get('/approvePayment',function(req,res){
            res.render('approvePayment')
        });

        app.get('/sendtocheckout',function(req,res){
            const total=parseInt(req.query.total);
            res.render('checkout',{total:total});
        });

        app.get('/orderPlaced',function(req,res){
            console.log('heroaaaa')
            res.render('orderPlaced');
        });

        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
        