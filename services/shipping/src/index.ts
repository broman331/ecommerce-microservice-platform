import app from './app';

const PORT = process.env.PORT || 3009;

app.listen(PORT, () => {
    console.log(`Shipping Service running on port ${PORT}`);
});
