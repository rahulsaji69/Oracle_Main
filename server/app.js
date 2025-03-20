const cors = require('cors');

app.use(cors());
// Or with specific options
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST']
})); 