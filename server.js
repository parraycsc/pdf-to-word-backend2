
const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

const API_KEY = 'parrayimu@gmail.com_fGyEkurYOVrkwmqtyvS4tUUNrA3p8uN1SDnfgMmy5RjsxXASFqhZkx34GqxCaWnp';

app.use(express.json());

app.post('/convert', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('name', 'converted.docx');

    try {
        const response = await fetch('https://api.pdf.co/v1/pdf/convert/to/doc', {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                ...form.getHeaders()
            },
            body: form
        });

        const data = await response.json();
        fs.unlinkSync(filePath); // cleanup

        if (data.error) {
            return res.status(400).json({ error: data.message });
        }

        res.json({ url: data.url });
    } catch (error) {
        fs.unlinkSync(filePath); // cleanup
        res.status(500).json({ error: 'Conversion failed.' });
    }
});

app.get('/', (req, res) => res.send('PDF to Word API is running.'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
