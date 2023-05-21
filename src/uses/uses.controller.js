const path = require("path");
const uses = require(path.resolve("src/data/uses-data"))


function useExists(req,res,next) {
  const useId = Number(req.params.useId);
  const foundUse = uses.find((use) => use.id === useId );
  if(foundUse) {
    return next();
  }
  next({ 
  status: 404,
  message: `${useId}`})
}

function list(req, res){
  res.json({ data: uses });
}

function read(req, res){
  const useId = Number(req.params.useId);
  const foundUse = uses.find((use) => use.id === useId );
  res.json({ data: foundUse })
}

function destroy(req, res, next){
  const { useId } = req.params;
  const index = uses.findIndex((use) => use.id === Number(useId));
  if(index > -1){
    uses.splice(index, 1);
  }
  res.sendStatus(204);
}

module.exports = {
  list,
  read,
  delete: [useExists, destroy]
}