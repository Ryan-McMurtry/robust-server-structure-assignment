const path = require("path");
const urls = require(path.resolve("src/data/urls-data"));
const uses = require(path.resolve("src/data/uses-data"));


function create(req, res) {
  const { data: { href } = {} } = req.body;
  const newUrl = {
    id: urls.length + 1,
    href,
  }
  urls.push(newUrl);
  res.status(201).json({ data: newUrl });
}

function hasHref(req, res, next) {
  const { data: { href } = {} } = req.body;
  
  if(href){
    return next();
  }
  next({ status: 400, message: `href` })
}

function list(req, res) {
  res.json({ data: urls });
}

function listUses(req, res) {
  const urlId = Number(req.params.urlId);
  const foundUses = uses.filter((use) => use.urlId === urlId );
  if(foundUses){
    res.json({ data: foundUses })
  }
  res.sendStatus(200);
}

function useMetric(req, res, next){
  const urlId = Number(req.params.urlId); 
  const useId = Number(req.params.useId);
  const foundUses = uses.filter((use) => use.urlId === urlId );
  const foundUse = foundUses.find((use) => use.id === useId);
  if(foundUse){
    res.json({ data: foundUse })
  }
  next({
    status: 404,
    message: `${useId}`
  })
}

function urlExists(req,res,next) {
  const urlId = Number(req.params.urlId);
  const foundUrl = urls.find((url) => url.id === urlId );
  if(foundUrl) {
    return next();
  }
  next({ 
  status: 404,
  message: `${urlId}`})
}

function read(req, res) {
  const urlId = Number(req.params.urlId);
  const foundUrl = urls.find((url) => url.id === urlId );
  const newUse = {
    id: uses.length + 1,
    urlId: urlId,
    time: Date.now(),
  }
  uses.push(newUse);
  res.json({ data: foundUrl })
}

function update(req, res) {
  const urlId = Number(req.params.urlId);
  const foundUrl = urls.find((url) => url.id === urlId );
  
  const { data: { href } = {} } = req.body;
  
  foundUrl.href = href;
  
  res.json({ data: foundUrl })
}

function destroy(req, res, next){
  const { urlId } = req.params;
  const index = urls.findIndex((url) => url.id === Number(urlId));
  if(index > -1){
    urls.splice(index, 1);
  }
  res.sendStatus(204);
}



module.exports = {
  list,
  listUses: [urlExists, listUses],
  useMetric: [urlExists, useMetric],
  create: [hasHref, create],
  read: [urlExists, read],
  update: [urlExists, hasHref, update],
  delete: destroy,
}