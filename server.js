const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

app.post('/contact', upload.single('userImage'), (req, res) => {
    const { name, email, message } = req.body;
    const file = req.file;

    if (!file) return res.status(400).send('No file uploaded.');

    res.send(`
        <html>
        <head>
            <title>Post: ${name}</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
                body { background-color: #f4f6f9; color: #333; }
                
                /* Header */
                header { background-color: #ffffff; border-bottom: 1px solid #e1e4e8; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
                .brand { font-size: 20px; font-weight: 600; color: #2c3e50; text-decoration: none; }
                .nav-link { background-color: #2c3e50; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; }
                .nav-link:hover { background-color: #34495e; }

                /* Main Container */
                .container { max-width: 800px; margin: 40px auto; padding: 0 20px; }
                
                /* Card Layout */
                .card { background-color: #ffffff; border-radius: 12px; border: 1px solid #e1e4e8; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; }
                
                /* Image Preview Box */
                .image-container { width: 100%; background-color: #000; display: flex; justify-content: center; align-items: center; max-height: 500px; }
                .image-container img { width: 100%; height: auto; max-height: 500px; object-fit: contain; }

                /* Content Body */
                .card-body { padding: 24px; }
                .post-title { font-size: 24px; font-weight: 700; color: #2c3e50; margin-bottom: 8px; }
                
                .meta-info { display: flex; gap: 16px; font-size: 13px; color: #65676b; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f0f2f5; }
                .meta-info span i { margin-right: 5px; color: #3498db; }

                .section-label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #8898aa; margin-bottom: 6px; letter-spacing: 0.5px; }
                .message-box { background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 14px 18px; border-radius: 0 8px 8px 0; font-size: 15px; color: #4a5568; line-height: 1.6; }
            </style>
        </head>
        <body> 
            <header>
                <a href="/" class="brand">Media Portal</a>
                <a href="/" class="nav-link"><i class="fa-solid fa-arrow-left"></i> Back to Upload</a>
            </header>

            <div class="container">
                <div class="card">
                    <div class="image-container">
                        <img src="/uploads/${file.filename}" alt="Uploaded Image" />
                    </div>
                    
                    <div class="card-body">
                        <h1 class="post-title">${name}</h1>
                        
                        <div class="meta-info">
                            <span><i class="fa-regular fa-envelope"></i> ${email}</span>
                            <span><i class="fa-regular fa-clock"></i> Just now</span>
                        </div>

                        <div class="section-label">Description / Message</div>
                        <div class="message-box">${message || 'No description provided.'}</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});