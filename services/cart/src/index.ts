import app from './app';

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
    console.log(`Cart Service running on port ${PORT}`);
});
