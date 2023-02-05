const express = require('express')
const router = express.Router()
const Item = require('../Model/Item')
const path = require('path')
const fs = require('fs')

const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `admin-${file.fieldname}-${Date.now()}.${ext}`);
    },
});


const upload = multer({ storage: storage })

router.post('/createitem',
    upload.single('picURL'),
    async (req, res) => {

        try {
            const item = await Item.create({

                picURL: req.file.filename,
            })
            res.json(item)
        } catch (error) {
            console.log('file not uploaded')
            console.log(error.message)
            return res.status(500).json('Internal server error')
        }
    })


//Route 2

router.get('/fectchitemall',
    async (req, res) => {
        try {
            const getitem = await Item.find({})
            // res.json(getitem)

            res.json(getitem)


        } catch (error) {
            console.log(error.message)
            return res.status(500).json("internal server error")

        }

    })

router.get('/fectchiteminfo',
    async (req, res) => {
        try {

            const files = fs.readdirSync('uploads/', 'utf8');
            const response = [];
            for (let file of files) {
                const extension = path.extname(file);
                const fileSizeInBytes = fs.statSync('uploads/' + file).size;
                var mtime = fs.statSync('uploads/' + file).mtime;
                var ctime = fs.statSync('uploads/' + file).ctime;

                response.push({ name: file, extension, fileSizeInBytes, mtime, ctime });
            }
            console.log(response)

            res.send(response)


        } catch (error) {
            console.log(error.message)
            return res.status(500).json("internal server error")

        }

    })
router.get('/fetchitem/:id',
    async (req, res) => {
        try {
            const serchitem = await Item.findById(req.params.id)
            if (!serchitem) {
                return res.status(400).json('not found')
            }
            // serchitem = await Item.find()
            res.json(serchitem);
        }

        catch (error) {
            console.log(error.message)
            return res.status(500).json('internal server error')
        }
    }
)

//Route 3

router.delete('/deleteitem',
    async (req, res) => {
        try {
            // const { id } = req.body

            console.log(req.headers.id)

            fs.unlink(`../backend/uploads/${req.headers.id}`, function (err) {
                if (err) return console.log(err);
                console.log('file deleted successfully');
            });
            // res.json({ "Success": "item has been deleted", itemdel: itemdel });
        } catch (error) {
            console.log(error.message)

            return res.status(500).json('internal server error')
        }
    }
)


//Route 4 

// router.put('/updateitem/:id',
//     upload.single('picURL'),

//     async (req, res) => {
//         // const  {name, detail, location,picURL } = req.body;

//         try {


//             const newname = req.body.name;
//             const newdetail = req.body.detail;
//             const newlocation = req.body.location;
//             const newprice = req.body.price;
//             const newpicURL = req.file.filename;


//             var updateitem = await Item.findById(req.params.id)
//             if (!updateitem) {
//                 return res.status(400).json('not found')
//             }
//             updateitem = await Item.findByIdAndUpdate(req.params.id, { name: newname, detail: newdetail, location: newlocation, price: newprice, picURL: newpicURL })
//             res.json({ updateitem });
//         }

//         catch (error) {
//             console.log(error.message)
//             return res.status(500).json("internal server error")

//         }
//     })




// router.put('/updateitemlike/:id',
//     async (req, res) => {
//         // const  {name, detail, location,picURL } = req.body;

//         try {


//             // const newlike = req.body.like;

//             var updateitemlike = await Item.findById(req.params.id)
//             if (!updateitemlike) {
//                 return res.status(400).json('not found')
//             }
//             updateitemlike = await Item.findByIdAndUpdate(req.params.id, { $inc: { like: 1 } })
//             res.json({ updateitemlike });
//         }

//         catch (error) {
//             console.log(error.message)
//             return res.status(500).json("internal server error")

//         }
//     })

// //route 5 fetch likes

// router.get('/fetchitemlike/:id',
//     async (req, res) => {
//         try {
//             const serchitemlike = await Item.findById(req.params.id)
//             if (!serchitemlike) {
//                 return res.status(400).json('not found')
//             }
//             // serchitem = await Item.find()
//             res.json(serchitemlike.like);
//         }

//         catch (error) {
//             console.log(error.message)
//             return res.status(500).json('internal server error')
//         }
//     }
// )

module.exports = router;