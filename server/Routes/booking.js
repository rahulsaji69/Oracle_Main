const upload = multer({
  dest: 'uploads/'
  // other options...
});

// This expects a field named "file" (singular)
router.post('/bookings', upload.single('file'), (req, res) => {
  // handler code
});

// OR you might have:
// This expects a field named "files" (plural)
router.post('/bookings', upload.array('files', 10), (req, res) => {
  // handler code
}); 