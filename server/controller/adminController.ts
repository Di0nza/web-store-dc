class AdminController{

    async getAll(req, res){
        return res.json({res: "ADMIN"});
    }

}
module.exports = new AdminController();