class ProductController{

    async getAll(req, res){
        return res.json({res: "YES"});
    }

}
module.exports = new ProductController();