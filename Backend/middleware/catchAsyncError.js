module.exports = (thisfunc) => (req,res ,next) => {
    Promise.resolve(thisfunc(req, res, next)).catch(next)
};